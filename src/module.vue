<template>
  <private-view :title="t('title')" class="find-duplicates-ui">
    <div class="step">
      <h2>{{ t('selectCollection') }}</h2>
      <v-select
        v-model="selectedCollection"
        :items="collections"
        item-text="label"
        item-value="value"
        :label="t('chooseCollection')"
        @update:modelValue="onCollectionChange"
      />
    </div>

    <div class="step">
      <h2>{{ t('selectField') }}</h2>
      <v-select
        v-model="selectedFields"
        :items="availableFields"
        item-text="label"
        item-value="value"
        :label="t('chooseField')"
        multiple
        :disabled="!selectedCollection"
      />
    </div>

    <div class="step button-group">
      <v-button @click="findDuplicates" :disabled="selectedFields.length === 0">
        {{ t('findDuplicates') }}
      </v-button>
      <v-button
        v-if="duplicates.length > 0"
        @click="deleteAllDuplicates"
        :disabled="deletingAll"
      >
        {{ deletingAll ? t('deletingAll') : t('deleteAllDuplicates') }}
      </v-button>
    </div>

    <div v-if="duplicates.length === 0 && alreadySearched" class="alert success">
      {{ t('noDuplicates') }}
    </div>

    <div v-if="duplicates.length > 0" class="step">
      <h2>{{ t('duplicatesFound') }} ({{ duplicates.length }})</h2>
      <div class="duplicates-list">
        <v-card v-for="(group, index) in duplicates" :key="index" class="duplicate-group">
        <div class="duplicate-group-header">
          {{ t('duplicatesFor') }}:
          <span class="duplicate-group-values">
            {{ selectedFields.map(f => group.items[0][f]).join(' | ') }}
          </span>
          ({{ group.items.length }} {{ t('times') }})
        </div>

        <ul>
          <li v-for="(item, itemIndex) in group.items" :key="item.id" class="duplicate-item">
            <div class="duplicate-item-content">
              <a
                :href="`/admin/content/${selectedCollection}/${item.id}`"
                class="text-primary underline"
                target="_blank"
              >
                {{ t('openItem') }} #{{ item.id }}
              </a>
              <v-button
                v-if="itemIndex > 0"
                :disabled="deletingItems.has(item.id)"
                @click="deleteItem(item.id, index)"
                icon
                small
                rounded
                secondary
                class="delete-button"
                :title="deletingItems.has(item.id) ? t('deleting') : t('delete')"
              >
                <v-icon name="delete" />
              </v-button>
            </div>
          </li>
        </ul>
        </v-card>
      </div>
    </div>
  </private-view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';
import { messages, resolveLocale } from './i18nModule';

const api = useApi();
const { useCollectionsStore, useFieldsStore } = useStores();
const collectionsStore = useCollectionsStore();
const fieldsStore = useFieldsStore();

const selectedCollection = ref(null);
const selectedFields = ref([]);
const duplicates = ref([]);
const alreadySearched = ref(false);
const deletingItems = ref(new Set());
const deletingAll = ref(false);


const { useSettingsStore } = useStores();
const { settings } = useSettingsStore();
const defaultLanguage = settings?.default_language;

const { t } = useI18n({
  locale: resolveLocale(defaultLanguage),
  messages,
});


watch(selectedFields, () => {
  duplicates.value = [];
  alreadySearched.value = false;
});

const collections = computed(() => {
  return Object.values(collectionsStore.collections)
    .filter((col) => !col.system)
    .map((col) => ({
      label: col.name.charAt(0).toUpperCase() + col.name.slice(1),
      value: col.collection,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const availableFields = computed(() => {
  if (!selectedCollection.value) return [];
  const allFields = fieldsStore.getFieldsForCollection(selectedCollection.value);
  return allFields
    .map((f) => ({
      label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
      value: f.field,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

async function onCollectionChange() {
  selectedFields.value = [];
  duplicates.value = [];
  alreadySearched.value = false;
}
async function findDuplicates() {
  duplicates.value = [];
  alreadySearched.value = false;

  const fields = selectedFields.value;
  const collection = selectedCollection.value;

  if (!fields.length) return;

  const { data } = await api.get( `/items/${collection}`, {
    params: {
      limit: -1,
      fields: ['id', ...fields],
    },
  });

  const map = {};
  for (const item of data.data) {
    const key = fields
      .map((f) => (item[f] ?? '').toString().trim().toLowerCase())
      .join('||');

    if (!key) continue;

    if (!map[key]) map[key] = [];
    map[key].push(item);
  }

  duplicates.value = Object.entries(map)
    .filter(([, items]) => items.length > 1)
    .map(([value, items]) => ({ value, items }));

  alreadySearched.value = true;
}

async function deleteItem(itemId, groupIndex) {
  if (!confirm(t('confirmDelete'))) {
    return;
  }

  deletingItems.value.add(itemId);

  try {
    await api.delete(`/items/${selectedCollection.value}/${itemId}`);
    
    // Find and remove the item from the duplicates array
    const itemIndex = duplicates.value[groupIndex].items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      duplicates.value[groupIndex].items.splice(itemIndex, 1);
      
      // If only one item remains, remove the entire group
      if (duplicates.value[groupIndex].items.length <= 1) {
        duplicates.value.splice(groupIndex, 1);
      }
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert(t('deleteError'));
  } finally {
    deletingItems.value.delete(itemId);
  }
}

async function deleteAllDuplicates() {
  // Count total items to delete
  const totalToDelete = duplicates.value.reduce((sum, group) => sum + (group.items.length - 1), 0);
  
  const confirmMessage = t('confirmDeleteAll').replace('{count}', totalToDelete);
  if (!confirm(confirmMessage)) {
    return;
  }

  deletingAll.value = true;

  try {
    // Process groups in reverse order to avoid index shifting issues
    for (let groupIndex = duplicates.value.length - 1; groupIndex >= 0; groupIndex--) {
      const group = duplicates.value[groupIndex];
      
      // Delete all items except the first one (index 0)
      for (let itemIndex = group.items.length - 1; itemIndex > 0; itemIndex--) {
        const item = group.items[itemIndex];
        deletingItems.value.add(item.id);
        
        try {
          await api.delete(`/items/${selectedCollection.value}/${item.id}`);
          group.items.splice(itemIndex, 1);
        } catch (error) {
          console.error(`Error deleting item ${item.id}:`, error);
          // Continue with other items even if one fails
        } finally {
          deletingItems.value.delete(item.id);
        }
      }
      
      // Remove the group if only one item remains (or if all were deleted)
      if (group.items.length <= 1) {
        duplicates.value.splice(groupIndex, 1);
      }
    }
  } catch (error) {
    console.error('Error deleting all duplicates:', error);
    alert(t('deleteAllError'));
  } finally {
    deletingAll.value = false;
  }
}
</script>

<style scoped>
.step {
  margin-bottom: 30px;
  padding: 0 46px;
}

.step > h2 {
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.button-group .v-button {
  flex-shrink: 0;
}

.duplicates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.duplicate-group {
  margin-bottom: 0;
  padding: 16px;
}

.duplicate-group-header {
  font-weight: bold;
  margin-bottom: 8px;
}

.duplicate-group-values {
  margin-left: 8px;
}

.text-primary {
  color: var(--primary);
}

.alert {
  padding: 12px 46px;
  border-radius: 6px;
  margin-top: 16px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.alert.success {
  background: var(--theme--success-background, #e0ffe0);
  color: var(--theme--success-foreground, #067d06);
  border: 1px solid var(--theme--success-border, #9de89d);
}

.duplicate-item {
  list-style: disc;
}

.duplicate-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-button {
  margin-left: auto;
  flex-shrink: 0;
}

.delete-button :deep(.v-icon),
.delete-button :deep(svg),
.delete-button :deep(i) {
  color: var(--primary) !important;
}

.delete-button:hover :deep(.v-icon),
.delete-button:hover :deep(svg),
.delete-button:hover :deep(i) {
  color: var(--primary-125) !important;
}

.delete-button:disabled :deep(.v-icon),
.delete-button:disabled :deep(svg),
.delete-button:disabled :deep(i) {
  color: var(--foreground-subdued) !important;
  opacity: 0.5;
}

.delete-all-button {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>