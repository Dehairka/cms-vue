<template>
    <div class="h-full">
        <div class="flex flex-col justify-center items-center h-full no-drag" v-if="!websites.length">
            <div class="flex items-center justify-center">
                <img class="w-1/3 mr-4" src="../assets/logo.svg" alt="logo icon">
                <h1 class="text-2xl uppercase font-black">CMS VUE</h1>
            </div>
            <button class="btn mt-4" @click="goToPage('/create')">Create a website</button>
        </div>
        <div v-else class="grid grid-cols-3 gap-4 p-4">
            <div @click="chooseWebsite(website)" v-for="(website, index) in websites" :key="index"
                class="bg-slate-600 cursor-pointer rounded-lg transition hover:bg-slate-500 text-slate-300 hover:text-slate-800">
                <img class="rounded-t-lg w-full object-contain object-top" src="../assets/img/default.png"
                    alt="website image">
                <span class="inline-block p-4 font-semibold ">{{ website }}</span>
            </div>
            <div @click="goToPage('/create')"
                class="bg-slate-600 cursor-pointer rounded-lg transition hover:bg-slate-500 text-slate-300 hover:text-slate-800 h-full flex items-center justify-center">
                <PlusIcon class=" w-20 h-20" />
                <span class="text-xl font-semibold">Add a website</span>
            </div>
        </div>
    </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/24/solid'
import { ipcRenderer } from 'electron'
import { useWebsiteStore } from '../stores/WebsiteStore'

export default {
    components: {
        PlusIcon
    },
    data() {
        return {
            websites: []
        }
    },
    mounted() {
        ipcRenderer.invoke('get-websites').then((websites) => {
            this.websites = websites
        })
    },
    methods: {
        goToPage(path) {
            this.$router.push(path)
        },
        async chooseWebsite(website) {
            const websiteChoosen = await ipcRenderer.invoke('choose-website', website)
            const store = useWebsiteStore()
            store.setWebsite(websiteChoosen)
            this.$router.push('/dashboard')
        }
    }
}
</script>