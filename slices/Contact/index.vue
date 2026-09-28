<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { locations } from '~/data/locations'

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
    id="kontakt"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container mx-auto px-4 py-8 md:grid md:grid-cols-2 md:gap-8 xl:p-8">
      <article class="my-8">
        <h2 class="font-semibold text-2xl mb-4">
          <NuxtLink class="underline" to="/turek/">
            Gabinet w {{ locations.turek.cityLocative }}
          </NuxtLink>
        </h2>
        <ClinicCard :location="locations.turek" />
      </article>
      <article class="my-8">
        <h2 class="font-semibold text-2xl mb-4">
          <NuxtLink class="underline" to="/poddebice/">
            Gabinet w {{ locations.poddebice.cityLocative }}
          </NuxtLink>
        </h2>
        <ClinicCard :location="locations.poddebice" />
      </article>
    </div>
  </section>
</template>
