<script setup>
const settings = useSettings();

console.log(settings);
</script>

<template>
  <div class="bg-slate-900 text-white p-2">
    <div class="container mx-auto flex justify-between">
      <div class="flex gap-x-2">
        <a :href="`tel:+48${settings.data.phone_turek}`">
          Turek: {{ settings.data.phone_turek }}
        </a>
        <a :href="`tel:+48${settings.data.phone_poddebice}`">
          Poddębice: {{ settings.data.phone_poddebice }}
        </a>
      </div>
      <div class="flex gap-x-2">
        <span>Pn. - Pt.: {{ settings.data.godziny }}</span>
        <a :href="`mailto:${settings.data.email}`">{{ settings.data.email }}</a>
      </div>
    </div>
  </div>
</template>
