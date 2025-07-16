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

    <div class="step">
      <v-button @click="findDuplicates" :disabled="selectedFields.length === 0">
        {{ t('findDuplicates') }}
      </v-button>
    </div>

    <div v-if="duplicates.length === 0 && alreadySearched" class="alert success">
      {{ t('noDuplicates') }}
    </div>

    <div v-if="duplicates.length > 0" class="step">
      <h2>{{ t('duplicatesFound') }} ({{ duplicates.length }})</h2>
      <v-card v-for="(group, index) in duplicates" :key="index" class="p-4">
        <div class="font-bold mb-2">
          {{ t('duplicatesFor') }}:
          <span class="ml-2">
            {{ selectedFields.map(f => group.items[0][f]).join(' | ') }}
          </span>
          ({{ group.items.length }} {{ t('times') }})
        </div>

        <ul>
          <li v-for="item in group.items" :key="item.id">
            <a
              :href="/admin/content/${selectedCollection}/${item.id}"
              class="text-primary underline"
              target="_blank"
            >
              {{ t('openItem') }} #{{ item.id }}
            </a>
          </li>
        </ul>
      </v-card>


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

  const { data } = await api.get(/items/${collection}, {
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
</script>

<style scoped>
.step {
  margin-bottom: 30px;
  padding: 0 46px;
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
</style>