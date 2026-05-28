import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/index.css";
import { createPinia } from "pinia";
import { useThemeStore } from "./stores/theme";
import "tdesign-vue-next/es/style/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router);

const themeStore = useThemeStore(pinia);
themeStore.init();

app.mount("#app");
