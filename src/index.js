import { defineModule } from '@directus/extensions-sdk';
import FindDuplicatesPage from './module.vue';

export default defineModule({
  id: 'directus-extension-find-duplicates',
  name: 'Find Duplicates',
  icon: 'search',
  routes: [
    {
      path: '',
      component: FindDuplicatesPage,
    },
  ],
});