<script setup lang="ts">
import { ref } from "vue";
import { useSwipe } from '@vueuse/core'
import ChevronIcon from "../../public/chevron.svg";
import CloseIcon from "../../public/close.svg"
import { type Content } from "@prismicio/client";


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

const dialog = ref<HTMLDialogElement | null>(null);
const visible = ref(false);
const currentPic = ref(undefined);

const { isSwiping, direction } = useSwipe(dialog, {
  onSwipeEnd() {
    if (isSwiping && direction.value === "right") {
      nextPic(currentPic.value.id)
    }
    if (isSwiping && direction.value == "left") {
      prevPic(currentPic.value.id)
    }
  }
})

const showDialog = (src, alt, id) => {
  dialog.value?.showModal();
  currentPic.value = { src, alt, id };
  visible.value = true;
};

const closeDialog = () => {
  dialog.value?.close()
};

const clickDialog = (event) => {
  if (event.target === dialog.value) {
    closeDialog()
  }
}

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

</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto"
  >
    <div class="flex flex-wrap">
      <div
        v-for="(pic, i) in slice.items"
        :key="`pic-${pic.image.id}`"
        class="h-64 basis-full sm:basis-1/2 xl:basis-1/4 cursor-pointer"
      >
        <NuxtImg
          class="object-cover h-full w-full"
          :src="pic.image.url"
          :alt="pic.image.alt"
          @click="showDialog(pic.image.url, pic.image.alt, i)"
        />
      </div>

      <dialog
        ref="dialog"
        class="gallery-item bg-transparent max-w-full text-white"
        @click="clickDialog"
        @close="visible = false"
        @keyup.left="prevPic(currentPic.id)"
        @keyup.right="nextPic(currentPic.id)"
      >
        <form
          v-if="visible"
          class="flex max-w-full"
          method="dialog"
        >
          <button
            type="button"
            class="hidden lg:block outline-0"
            @click="prevPic(currentPic.id)"
          >
            <ChevronIcon class="w-6 h-6 rotate-180" />
          </button>
          <NuxtImg
            class="select-none"
            :src="currentPic.src"
            :alt="currentPic.alt"
          />
          <button
            type="button"
            class="hidden lg:block outline-0"
            @click="nextPic(currentPic.id)"
          >
            <ChevronIcon class="w-6 h-6" />
          </button>
        </form>
        <CloseIcon
          class="w-6 h-6 fixed top-0 right-0 m-10"
          @click="closeDialog"
        />
      </dialog>
    </div>
  </section>
</template>

<style scoped>
.gallery-item {
  outline: 0;

  &::backdrop {
    background: rgba(0, 0, 0, .7);
  }
}
</style>
