<template>
  <div class=" h-screen w-full bg-slate-300 drag text-slate-800 grid grid-cols-5 grid-rows-12 gap-0">
    <nav class="bg-slate-400 h-full row-span-5" v-if="website">
      <div class="flex items-center p-4 no-drag cursor-pointer" @click="goToPage('/')">
        <img class="w-8 mr-4" src="./assets/logo.svg" alt="logo icon">
        <h1 class="text-2xl uppercase font-black">CMS VUE</h1>
      </div>
      <ul class="no-drag">
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/dashboard')">
          <HomeIcon class="w-6 h-6 mr-4" />
          <router-link to="/dashboard" class="">Dashboard</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <ClipboardDocumentListIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Posts</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <CameraIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Media</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <DocumentDuplicateIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Pages</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <PaintBrushIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Appareance</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <CircleStackIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Plugins</router-link>
        </li>
        <li
          class="w-full  py-2 px-4 cursor-pointer transition hover:bg-slate-500 hover:text-slate-300 font-semibold flex items-center"
          @click="goToPage('/')">
          <WrenchScrewdriverIcon class="w-6 h-6 mr-4" />
          <router-link to="/" class="">Setttings</router-link>
        </li>
      </ul>
    </nav>
    <header class="bg-slate-500 max-h-16 drag flex items-center justify-between p-4"
      :class="website ? 'col-span-4' : 'col-span-5'">
      <div class="flex items-center">
        <button class="mr-4">
          <ChevronLeftIcon class="w-6 h-6 text-slate-300" />
        </button>
        <h2 class="text-slate-300 font-semibold uppercase">{{ $route.name }}</h2>
      </div>
      <div class="flex items-center no-drag">
        <button @click="minimizeApp()">
          <MinusIcon class="w-6 h-6 text-slate-300 mr-4" />
        </button>
        <button @click="fullscreenApp()">
          <ArrowsPointingOutIcon v-if="!isFullScreen" class="w-6 h-6 text-slate-300 mr-4" />
          <ArrowsPointingInIcon v-else class="w-6 h-6 text-slate-300 mr-4" />
        </button>
        <button @click="closeApp()">
          <XMarkIcon class="w-6 h-6 text-slate-300" />
        </button>
      </div>
    </header>
    <div class="row-span-4 row-start-2 no-drag" :class="website ? 'col-span-4 col-start-2' : 'col-span-5'">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ClipboardDocumentListIcon, WrenchScrewdriverIcon, CameraIcon, DocumentDuplicateIcon, HomeIcon, ChevronLeftIcon, XMarkIcon, ArrowsPointingOutIcon, MinusIcon, ArrowsPointingInIcon, CircleStackIcon, AdjustmentsHorizontalIcon, PaintBrushIcon } from '@heroicons/vue/24/solid'
import { ipcRenderer } from 'electron'
import { useWebsiteStore } from './stores/WebsiteStore'

export default {
  components: {
    HomeIcon,
    ChevronLeftIcon,
    XMarkIcon,
    ArrowsPointingOutIcon,
    MinusIcon,
    ArrowsPointingInIcon,
    CircleStackIcon,
    AdjustmentsHorizontalIcon,
    PaintBrushIcon,
    DocumentDuplicateIcon,
    CameraIcon,
    WrenchScrewdriverIcon,
    ClipboardDocumentListIcon
  },
  data() {
    return {
      isFullScreen: false
    }
  },
  computed: {
    website() {
      const store = useWebsiteStore()
      return store.website
    }
  },
  methods: {
    goToPage(path) {
      this.$router.push(path)
    },
    closeApp() {
      ipcRenderer.send('close-app')
    },
    async fullscreenApp() {
      this.isFullScreen = await ipcRenderer.invoke('fullscreen-app')
    },
    minimizeApp() {
      ipcRenderer.send('minimize-app')
    }
  }
}
</script>

<style>
.drag {
  -webkit-app-region: drag
}

.no-drag {
  -webkit-app-region: no-drag
}</style>
