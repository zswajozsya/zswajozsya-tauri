import { createApp } from "vue";
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/aura-light-green/theme.css'

import "./styles.css";
import App from "./App.vue";

const pinia = createPinia()
const app = createApp(App);

app.use(pinia)
app.use(PrimeVue);
app.mount("#app");
