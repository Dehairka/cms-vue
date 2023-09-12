<template>
    <div class="px-4">
        <div class="grid grid-cols-3 gap-4">
            <div
                class="bg-slate-600 cursor-pointer rounded-lg transition hover:bg-slate-500 text-slate-300 hover:text-slate-800">
                <img class="rounded-t-lg" src="../assets/img/default.png" alt="image of template">
                <div class="p-4">
                    <h2>Template 1</h2>
                    <span>description</span>
                </div>
            </div>
            <div @click="goToPage('/create')"
                class="bg-slate-600 cursor-pointer rounded-lg transition hover:bg-slate-500 text-slate-300 hover:text-slate-800 h-full flex items-center justify-center">
                <PlusIcon class=" w-20 h-20" />
                <span class="text-xl font-semibold">Create a template</span>
            </div>
        </div>
    </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/24/solid'

export default {
    components: {
        PlusIcon
    },
}
</script>

<style lang="scss" scoped></style>