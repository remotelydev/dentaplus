<script setup lang="ts">
import { ref } from "vue";
import { type Content } from "@prismicio/client";

const dialog = ref();
const visible = ref(false);
const currentPic = ref(undefined);

const showDialog = (src, alt, id) => {
  dialog.value?.showModal();
  currentPic.value = { src, alt, id };
  visible.value = true;
};
const prevPic = (index) => {
  const prevId = index - 1;
  const lastPicIndex = props.slice.items.length - 1;

  if (index >= 1) {
    currentPic.value = {
      src: props.slice.items[prevId].image.url,
      alt: props.slice.items[prevId].image.alt,
      id: prevId,
    };
  } else {
    currentPic.value = {
      src: props.slice.items[lastPicIndex].image.url,
      alt: props.slice.items[lastPicIndex].image.alt,
      id: lastPicIndex,
    };
  }
};
const nextPic = (index) => {
  const nextId = index + 1;
  const lastPicIndex = props.slice.items.length - 1;

  if (index !== lastPicIndex) {
    currentPic.value = {
      src: props.slice.items[nextId].image.url,
      alt: props.slice.items[nextId].image.alt,
      id: nextId,
    };
  } else {
    currentPic.value = {
      src: props.slice.items[0].image.url,
      alt: props.slice.items[0].image.alt,
      id: 0,
    };
  }
};

defineExpose({
  show: showDialog,
  close: (returnVal) => dialog.value?.close(returnVal),
  visible,
  currentPic,
});

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.GallerySlice>([
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
    <div class="flex flex-wrap">
      <div
        v-for="(pic, i) in slice.items"
        class="h-64 basis-1/4"
        :key="pic.image.id">
        <NuxtImg
          class="object-cover h-full w-full"
          :src="pic.image.url"
          :alt="pic.image.alt"
          @click="showDialog(pic.image.url, pic.image.alt, i)" />
      </div>

      <dialog ref="dialog" @close="visible = false">
        <form v-if="visible" class="flex" method="dialog">
          <button type="button" @click="prevPic(currentPic.id)">prev</button>
          <NuxtImg :src="currentPic.src" :alt="currentPic.alt" />
          <button type="button" @click="nextPic(currentPic.id)">next</button>
        </form>
      </dialog>
    </div>
  </section>
  <!-- <pre>
    {{ slice }}
  </pre> -->
</template>
