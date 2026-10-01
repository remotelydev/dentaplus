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

// Hand-written widths. @nuxt/image 1.2 turns sizes="100vw" into 1w/2w srcset
// descriptors, which iOS Safari treats as a huge image. 800 covers a phone at
// ~2x, 1200 covers a 3x phone, 1400 covers the desktop hero.
const HERO_WIDTHS = [800, 1200, 1400] as const

const lcpImage = computed(() => {
  const field = props.slice.primary.backgroundImage
  if (!field?.url) return undefined
  const ratio = (field.dimensions?.height || 900) / (field.dimensions?.width || 1400)
  const sources = HERO_WIDTHS.map((width) => {
    const height = Math.round(width * ratio)
    return {
      width,
      height,
      src: prismic.asImageSrc(field, { auto: ['format', 'compress'], w: width, h: height }) || field.url,
    }
  })
  const desktop = sources[sources.length - 1]
  return {
    src: desktop.src,
    srcset: sources.map((source) => `${source.src} ${source.width}w`).join(', '),
    alt: field.alt?.trim() || DEFAULT_IMAGE_ALT,
    width: desktop.width,
    height: desktop.height,
  }
})

useHead(() => {
  const image = lcpImage.value
  if (!image) return {}
  return {
    link: [{
      key: 'hero-lcp',
      rel: 'preload',
      as: 'image',
      imageSrcset: image.srcset,
      imageSizes: '100vw',
      fetchpriority: 'high',
    }],
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
  <section class="relative flex flex-col bg-slate-800 text-white border-b border-slate-100 md:block md:min-h-[clamp(30rem,40vw,48rem)]">
    <figure
      v-if="lcpImage"
      class="w-full max-md:relative max-md:order-last max-md:aspect-[3/2] max-md:max-h-[40svh] md:absolute md:inset-0"
    >
      <img
        :src="lcpImage.src"
        :srcset="lcpImage.srcset"
        sizes="100vw"
        :alt="lcpImage.alt"
        :width="lcpImage.width"
        :height="lcpImage.height"
        fetchpriority="high"
        class="pointer-events-none select-none object-cover h-full w-full md:object-[50%_30%]"
      />
      <!-- Heads start ~45% down the desktop crop; the scrim must clear by then so faces stay undimmed. -->
      <div
        aria-hidden="true"
        class="absolute inset-0 hidden bg-gradient-to-b from-slate-900/75 via-slate-900/45 via-25% to-slate-900/0 to-45% md:block"
      />
    </figure>
    <Bounded
      y-padding="hero"
      class="relative max-md:py-8"
    >
      <div class="grid justify-items-center">
        <div class="w-full max-w-2xl md:pb-8 md:[text-shadow:0_1px_12px_rgb(15_23_42/0.55)]">
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
