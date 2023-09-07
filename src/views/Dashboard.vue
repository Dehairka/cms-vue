<template>
    <div class="p-4" v-if="website">
        <h1>Dashboard</h1>
        <pre>{{ website }}</pre>
    </div>
    <div class="p-4" v-else>
        Veuillez choisir un site sur <router-link class="font-semibold" to="/">la page d'accueil</router-link>
    </div>
</template>

<script>
import { HomeIcon } from '@heroicons/vue/24/solid'
import { useWebsiteStore } from '../stores/WebsiteStore'
export default {
    components: {
        HomeIcon
    },
    computed: {
        website() {
            const store = useWebsiteStore()
            return store.website
        }
    }
}
</script>