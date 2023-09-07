<template>
    <div class="p-4 flex flex-col">
        <label for="name">Name of the website</label>
        <input class="input" type="text" name="name" id="name" v-model="name" @keyup.enter="createWebsite()">
        <button class="btn mt-4" @click="createWebsite()">Create the website</button>
    </div>
</template>

<script>
import { useWebsiteStore } from '../stores/WebsiteStore'
import { ipcRenderer } from 'electron'

export default {
    data() {
        return {
            name: ''
        }
    },
    methods: {
        async createWebsite() {
            const store = useWebsiteStore()
            const website = {
                slug: this.name.toLowerCase().replace(/ /g, '-'),
                name: this.name
            }
            if (website.slug === '') {
                return
            }
            store.setWebsite(website)
            const websiteCreated = await ipcRenderer.invoke('create-website', website)
            console.log("🚀 ~ websiteCreated:", websiteCreated)
            // this.$router.push('/dashboard')
        }
    }
}
</script>