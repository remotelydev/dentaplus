<script setup>
import { ref } from "vue";

const dialog = ref();
const visible = ref(false);
const showDialog = () => {
  dialog.value?.showModal();
  visible.value = true;
};

defineExpose({
  show: showDialog,
  close: (returnVal) => dialog.value?.close(returnVal),
  visible,
});
</script>

<template>
  <div class="h-64">
    <NuxtImg
      class="object-cover h-full w-full"
      :src="src"
      :alt="alt"
      @click="showDialog"
      loading="lazy"
      provider="prismic" />
    <dialog ref="dialog" @close="visible = false">
      <form v-if="visible" class="flex" method="dialog" :class="classes">
        <button>prev</button>
        <NuxtImg :src="src" :alt="alt" loading="lazy" provider="prismic" />
        <button>next</button>
      </form>
    </dialog>
  </div>
</template>
