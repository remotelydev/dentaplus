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
    alt: field.alt?.trim() || DEFAULT_IMAGE_ALT,
    width: 1400,
    height: Math.round(1400 * ((field.dimensions?.height || 900) / (field.dimensions?.width || 1400))),
  }
})

const serializer: HTMLRichTextMapSerializer = {
  ...prismic.options.richTextSerializer,
  heading1: ({ children }) =>
    /* html */ `<h1 class="font-semibold leading-tight tracking-tight md:leading-tight text-[length:clamp(1.75rem,0.75rem+5vw,3rem)] md:text-7xl break-words hyphens-auto mb-4 mt-12 first:mt-0 last:mb-0">${children}</h1>`,
};

const normalizeCopy = (value: string | null | undefined) =>
  String(value || "").replace(/\s+/g, " ").trim();

const headingPlain = computed(() => {
  const field = props.slice.primary.text;
  if (Array.isArray(field)) {
    const heading = field.find((block) => block.type === "heading1");
    const fromHeading = normalizeCopy(
      heading && "text" in heading ? heading.text : ""
    );
    if (fromHeading) return fromHeading;
  }
  return normalizeCopy(prismic.asText(field));
});

const descriptionPlain = computed(() =>
  normalizeCopy(props.slice.primary.description)
);

const showDescription = computed(
  () =>
    Boolean(descriptionPlain.value) &&
    descriptionPlain.value.localeCompare(headingPlain.value, "pl", {
      sensitivity: "accent",
    }) !== 0
);
</script>

<template>
  <section class="relative flex flex-col bg-slate-800 text-white border-b border-slate-100 md:block">
    <!-- No `sizes` prop: @nuxt/image 1.2 turns 100vw into 1w/2w srcset descriptors, which iOS Safari reads as a ~273000px-wide image. -->
    <figure
      v-if="lcpImage"
      class="w-full max-md:relative max-md:order-last max-md:aspect-[3/2] max-md:max-h-[40svh] md:absolute md:inset-0"
    >
      <NuxtImg
        :src="lcpImage.src"
        :alt="lcpImage.alt"
        :width="lcpImage.width"
        :height="lcpImage.height"
        densities="x1"
        preload
        fetchpriority="high"
        class="pointer-events-none select-none object-cover h-full w-full md:opacity-80"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 hidden bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/0 md:block"
      />
    </figure>
    <Bounded
      y-padding="lg"
      class="relative max-md:py-8"
    >
      <div class="grid justify-items-center">
        <div class="w-full max-w-2xl md:pb-8">
          <PrismicRichText
            :field="slice.primary.text"
            :html-serializer="serializer"
            class="max-w-2xl text-center"
            wrapper="div"
          />
          <p
            v-if="showDescription"
            class="text-lg text-center md:text-2xl"
          >
            {{ slice.primary.description }}
          </p>
          <PrismicLink
            v-if="
              slice.primary.buttonLink &&
              ('id' in slice.primary.buttonLink ||
                'url' in slice.primary.buttonLink)
            "
            :field="slice.primary.buttonLink"
            class="mt-6 inline-block rounded bg-white px-5 py-3 font-medium text-slate-800"
          >
            {{ slice.primary.buttonText || "Umów wizytę" }}
          </PrismicLink>
        </div>
      </div>
    </Bounded>
  </section>
</template>
