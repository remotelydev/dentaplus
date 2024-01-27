<script setup lang="ts">
import { ref } from "vue";
import { type Content } from "@prismicio/client";

const dialog = ref();
const visible = ref(false);
const currentPersona = ref();

const showPersona = (src, alt) => {
  dialog.value?.showModal();
  currentPersona.value = { src, alt };
  visible.value = true;
};

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.PortraitsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto">
    <div class="max-w-7xl mx-auto flex flex-wrap justify-around gap-4 shrink">
      <Portrait
        v-for="(image, i) in slice.items"
        :key="image.name"
        class="shrink cursor-pointer"
        :class="i === 0 ? 'w-1/3 ml-24' : i === 1 ? 'w-1/3 mr-24' : 'w-1/6'"
        :portrait="image.portrait.url"
        :alt="image.portrait.alt"
        :name="image.name"
        :role="image.role"
        :index="i"
        @click="showPersona(image.portrait.url, image.portrait.alt)" />
    </div>
    <dialog ref="dialog" @close="visible = false">
      <form v-if="visible" method="dialg">
        <NuxtImg :src="currentPersona.src" :alt="currentPersona.alt" />
      </form>
    </dialog>
  </section>
</template>
