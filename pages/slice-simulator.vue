<script setup lang="ts">
import { SliceSimulator } from "@slicemachine/adapter-nuxt/simulator";
import { components } from "~/slices";

useSeoMeta({
  robots: "noindex, nofollow",
});
</script>

<template>
  <SliceSimulator v-slot="{ slices }">
    <SliceZone
      :slices="slices"
      :components="components"
    />
  </SliceSimulator>
</template>
