<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  src: string
  title: string
}>()

const ready = ref(false)

function whenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 })
  } else {
    setTimeout(callback, 200)
  }
}

const start = () => whenIdle(() => { ready.value = true })

onMounted(() => {
  if (document.readyState === 'complete') {
    start()
  } else {
    window.addEventListener('load', start, { once: true })
  }
})

onBeforeUnmount(() => window.removeEventListener('load', start))
</script>

<template>
  <iframe
    v-bind="$attrs"
    :src="ready ? src : undefined"
    :title="title"
    class="bg-slate-100"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  />
</template>
