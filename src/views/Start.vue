<template>
    <div class="p-4" v-if="website">
        <button class="btn" @click="startWebsite()">
            Start your website
        </button>
        <div class="bg-slate-900 text-slate-100 p-4 flex flex-col">
            <span v-for="log in logs">{{ log }}</span>
        </div>
    </div>
    <div v-else class="p-4 flex flex-col">
        <p class="text-slate-100 inline-block">
            You need to create a website first.
        </p>
        <router-link to="/" class="btn mt-4">
            Return to Home
        </router-link>
    </div>
</template>

<script>
import { useWebsiteStore } from '../stores/WebsiteStore'
import { ipcRenderer } from 'electron'

export default {
    data() {
        return {
            logs: []
        }
    },
    computed: {
        website() {
            const store = useWebsiteStore()
            return store.website
        }
    },
    mounted() {
        ipcRenderer.on('website-logs', (event, logs) => {
            this.logs.push(logs)
        })
    },
    methods: {
        async startWebsite() {
            const store = useWebsiteStore()
            const website = store.website
            console.log("🚀 ~ website:", website)
            const websiteStarted = await ipcRenderer.invoke('start-website', website)
            if (websiteStarted) {
                this.logs.push('Starting website...')
            }
        }
    }
}
</script>