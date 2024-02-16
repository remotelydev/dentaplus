<script setup lang="ts">
import { computed } from 'vue'
import { components } from '~/slices'

const prismic = usePrismic()
const route = useRoute()
const { data: page } = useAsyncData(route.params.uid as string, () =>
  prismic.client.getByUID('bio', route.params.uid as string || 'home')
)
const settings = useSettings()

useHead({
  title: computed(() => `${prismic.asText(page.value?.data.title)} | ${settings.value?.data.siteTitle}`)
})
</script>


<template>
  <SliceZone
    wrapper="main"
    class="slice-zone"
    :slices="page?.data.slices ?? []"
    :components="components"
  />
</template>

<style scoped>
.slice-zone {
  min-height: calc(100vh - 204px);
}
</style>
