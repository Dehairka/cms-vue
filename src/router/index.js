import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Create from "../views/Create.vue";

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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;