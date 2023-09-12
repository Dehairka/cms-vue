import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Create from "../views/Create.vue";
import Appareance from "../views/Appareance.vue";
import View from "../views/View.vue";
import Start from "../views/Start.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/create",
        name: "Create a website",
        component: Create,
    },
    {
        path: "/appareance",
        name: "Change appareance of the website",
        component: Appareance,
    },
    {
        path: "/view",
        name: "View your website",
        component: View,
    },
    {
        path: "/start",
        name: "Start your website",
        component: Start,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;