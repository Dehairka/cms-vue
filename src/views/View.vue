<template>
    <div class="h-full">
        <iframe class="w-full h-full" ref="iframe" src="http://localhost:5174" frameborder="0"></iframe>
    </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/24/solid'

export default {
    components: {
        PlusIcon
    },
    mounted() {
        this.$refs.iframe.addEventListener('load', () => {
            this.$refs.iframe.contentWindow.addEventListener('click', (e) => {
                console.log(e)
            })
        })
    }
}
</script>

<style lang="scss" scoped></style>