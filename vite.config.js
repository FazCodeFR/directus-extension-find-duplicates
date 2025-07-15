// Developing Directus extensions with hot-reloading
// https://github.com/u12206050/directus-extension-dev-canvas
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Update this with your Directus URL
const HOST_URL = 'http://127.0.0.1:8055';
const LOAD_IN_HOST = true;
// Update this with the correct values
// On root, run `node node_modules/directus-extension-dev-canvas/host-deps.js` to generate new list
// Current values are for a Directus 11.5.0
const HOST_DEPS = {
  "@directus/extensions-sdk": `${HOST_URL}/admin/assets/@directus_extensions-sdk.CYB79qUw.entry.js`,
  "pinia": `${HOST_URL}/admin/assets/pinia.CgQSnxxV.entry.js`,
  "vue-i18n": `${HOST_URL}/admin/assets/vue-i18n.DjdmXneM.entry.js`,
  "vue-router": `${HOST_URL}/admin/assets/vue-router.CUNOcKiw.entry.js`,
  "vue": `${HOST_URL}/admin/assets/vue.wgR5vgTp.entry.js`
};

export default defineConfig({
	plugins: [vue()],
	server: {
		cors: true,
	},
	resolve: {
		alias: {
			...(LOAD_IN_HOST ? HOST_DEPS : undefined),
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.d.ts'],
	},
});