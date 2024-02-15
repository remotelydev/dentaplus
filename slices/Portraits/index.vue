<script setup>
import { computed } from "vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

const dentaBosses = computed(() => {
  return props.slice.items.slice(0,2)
})
const dentaEmployees = computed(() => {
  return props.slice.items.slice(2, props.slice.items.length)
})

</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto mb-10">
    <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-4 shrink">
      <Portrait
        v-for="(image, i) in dentaBosses"
        :key="image.name"
        class="w-full sm:w-1/3 shrink cursor-pointer"
        :portrait="image.portrait.url"
        :alt="image.portrait.alt"
        :name="image.name"
        :role="image.role"
        :index="i"
        :link="image.details"
        :is-leader="true"
        @click="showPersona(image.portrait.url, image.portrait.alt)" />
    </div>
    <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-4 shrink">
      <Portrait
        v-for="(image, i) in dentaEmployees"
        :key="image.name"
        class="w-full sm:w-1/4 md:w-1/5 lg:w-1/6 shrink cursor-pointer"
        :portrait="image.portrait.url"
        :alt="image.portrait.alt"
        :name="image.name"
        :role="image.role"
        :index="i"
        :link="image.details"
        :is-leader="false"
        @click="showPersona(image.portrait.url, image.portrait.alt)" />
    </div>
  </section>
</template>
