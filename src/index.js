import { defineModule } from '@directus/extensions-sdk';
import FindDuplicatesPage from './module.vue';

export default defineModule({
  id: 'find-duplicates',
  name: 'Find Duplicates',
  icon: 'search',
  routes: [
    {
      path: '',
      component: FindDuplicatesPage,
    },
  ],
});