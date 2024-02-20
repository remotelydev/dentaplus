<script setup lang="ts">
import { useResizeObserver, useWindowSize } from '@vueuse/core'

import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';
import { type Content } from "@prismicio/client";

const settings = useSettings();

const contact = ref<HTMLElement | null>(null);
const mapWidth = ref<string>('');
const mapHeight = ref<string>('');
const { width: windowWidth } = useWindowSize()

useResizeObserver(contact, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;

  if (windowWidth.value < 768) {
    mapWidth.value = String(width);
    mapHeight.value = String(Math.floor(width * 2 / 3))
  } else if (windowWidth.value < 1280) {
    mapWidth.value = String(Math.floor(width / 2));
    mapHeight.value = String(Math.floor(width / 3))
  } else {
    mapWidth.value = String(Math.floor(width / 3));
    mapHeight.value = String(Math.floor(width * 2 / 9))
  }
})

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.ContactSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    id="#kontakt"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      ref="contact"
      class="container mx-auto xl:flex xl:justify-around xl:p-8"
    >
      <div class="my-8 md:flex md:items-center md:justify-center xl:flex-col xl:w-1/3 ">
        <div class="m-4 sm:grow sm:max-w-72 md:grow-0 md:w-80 md:max-w-80 xl:w-full xl:grow ">
          <PrismicRichText :field="slice.items[0].place" />
          <div class="flex items-center basis-1/3 gap-2 my-2 md:basis-1">
            <a href="https://www.instagram.com/klinika.dentaplus" target="_blank">
              <InstagramIcon class="w-6 h-6" />
            </a>
            <a href="https://www.facebook.com/dentaplusturek" target="_blank">
              <FacebookIcon class="w-6 h-6" />
            </a>
          </div>
          <p class="font-bold">Godziny otwarcia:</p>
          <p>Pn-Pt: 8:00 - 20:00</p>
          <p>Sb: 10:00 - 15:00</p>
          <PrismicRichText
            class="my-2"
            :field="slice.items[0].address"
            wrapper="address"
          />
          <a class="block" :href="`tel:${settings?.data.phone_turek}`">
            +48 {{ settings?.data.phone_turek }}
          </a>
          <a class="block" :href="`mailto:${settings?.data.email_turek}`">
            {{ settings?.data.email_turek }}
          </a>
        </div>
        <iframe
          :width="mapWidth"
          :height="mapHeight"
          class="mx-auto sm:mx-0 border-0"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2960.499578331064!2d18.49203025168515!3d52.010363023104674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471b1f53660b39ff%3A0x78e72c385ad3a531!2sDentaPlus%2B%20Klinika%20Stomatologii%20Turek!5e0!3m2!1sen!2spl!4v1708106259185!5m2!1sen!2spl"
        />
      </div>

      <div class="my-8 md:flex md:items-center md:justify-center xl:flex-col xl:w-1/3">
        <div class="m-4 sm:max-w-72 md:grow-0 md:w-80 md:max-w-80 xl:w-full xl:grow ">
          <PrismicRichText :field="slice.items[1].place" />
          <div class="flex items-center basis-1/3 gap-2 my-2 md:basis-1">
            <a href="https://www.instagram.com/klinika.dentaplus" target="_blank">
              <InstagramIcon class="w-6 h-6" />
            </a>
            <a href="https://www.facebook.com/dentapluspoddebice" target="_blank">
              <FacebookIcon class="w-6 h-6" />
            </a>
          </div>
          <p class="font-bold">Godziny otwarcia:</p>
          <p>Pn-Pt: 8:00 - 20:00</p>
          <p>Sb: 10:00 - 15:00</p>
          <PrismicRichText
            class="my-2"
            :field="slice.items[1].address"
            wrapper="address"
          />
          <a class="block" :href="`tel:${settings?.data.phone_poddebice}`">
            +48 {{ settings?.data.phone_poddebice }}
          </a>
          <a class="block" :href="`mailto:${settings?.data.email_poddebice}`">
            {{ settings?.data.email_poddebice }}
          </a>
        </div>
        <iframe
          :width="mapWidth"
          :height="mapHeight"
          class="mx-auto sm:mx-0 border-0"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4923.822194283992!2d18.954593433374907!3d51.89908649999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471babfad2d2912f%3A0xa355d5eb51cc0533!2sDentaPlus%2B%20Klinika%20Stomatologii%20Podd%C4%99bice!5e0!3m2!1sen!2spl!4v1708106558963!5m2!1sen!2spl"
        />
      </div>
    </div>
  </section>
</template>
