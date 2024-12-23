import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

createApp(App).use(router).use(VueAwesomePaginate).use(Datepicker).mount('#app')
// const app = createApp(App);
// app.use(router).use(VueAwesomePaginate).use(Datepicker)
// router.isReady().then(() => {
//   app.mount("#app");
// });
