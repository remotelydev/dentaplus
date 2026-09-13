<script setup lang="ts">
import {
  type Content,
  type HTMLRichTextMapSerializer,
} from "@prismicio/client";

// The array passed to \`getSliceComponentProps\` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.HeroSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
const prismic = usePrismic();
const lcpImage = computed(() => {
  const field = props.slice.primary.backgroundImage
  if (!field?.url) return undefined
  return {
    src: prismic.asImageSrc(field, { auto: ['format', 'compress'], w: 1400 }) || field.url,
    alt: field.alt || '',
    width: 1400,
    height: Math.round(1400 * ((field.dimensions?.height || 900) / (field.dimensions?.width || 1400))),
  }
})

const serializer: HTMLRichTextMapSerializer = {
  ...prismic.options.richTextSerializer,
  heading1: ({ children }) =>
    /* html */ `<h1 class="font-semibold leading-tight tracking-tight md:leading-tight text-5xl md:text-7xl mb-4 mt-12 first:mt-0 last:mb-0">${children}</h1>`,
};
</script>

<template>
  <section class="relative bg-slate-800 text-white border-b border-slate-100">
    <figure class="absolute inset-0">
      <NuxtImg
        v-if="lcpImage"
        :src="lcpImage.src"
        :alt="lcpImage.alt"
        :width="lcpImage.width"
        :height="lcpImage.height"
        sizes="100vw"
        preload
        fetchpriority="high"
        class="pointer-events-none select-none object-cover opacity-80 h-full w-full"
      />
    </figure>
    <Bounded
      y-padding="lg"
      class="relative"
    >
      <div class="grid justify-items-center">
        <div class="hidden sm:block pb-8">
          <PrismicRichText
            :field="slice.primary.text"
            :html-serializer="serializer"
            class="max-w-2xl text-center"
            wrapper="div"
          />
          <p
            v-if="slice.primary.description"
            class="text-2xl text-center"
          >
            {{ slice.primary.description }}
          </p>
          <!-- <PrismicLink
            v-if="
              slice.primary.buttonLink &&
              ('id' in slice.primary.buttonLink ||
                'url' in slice.primary.buttonLink)
            "
            :field="slice.primary.buttonLink"
            class="rounded bg-white px-5 py-3 font-medium text-slate-800"
          >
            {{ slice.primary.buttonText || "Learn More" }}
          </PrismicLink> -->
        </div>
      </div>
    </Bounded>
  </section>
</template>
