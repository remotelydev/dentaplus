<script setup>
import PhoneIcon from '../public/phone.svg'
const settings = useSettings();
</script>

<template>
  <div class="sticky top-0 z-50 bg-slate-900 text-white py-2">
    <div class="container mx-auto flex flex-col gap-2 text-xs xs:text-sm sm:flex-row sm:justify-end sm:items-center sm:gap-4 sm:px-4">
      <span class="text-center bold">Umów się na wizytę!</span>
      <div class="flex gap-3 justify-around">
        <span class="flex items-center gap-1">
          Turek:
          <a class="flex items-center min-w-0 bg-slate-100 px-2 py-1 text-slate-900 rounded-full whitespace-nowrap" :href="`tel:+48${settings.data.phone_turek}`">
            <PhoneIcon class="hidden sm:inline-block w-4 h-4 rouded-full mr-1" />
            {{ settings.data.phone_turek }}
          </a>
        </span>
        <span class="flex items-center gap-1">
          Poddębice:
          <a class="flex items-center min-w-0 bg-slate-100 px-2 py-1 text-slate-900 rounded-full whitespace-nowrap" :href="`tel:+48${settings.data.phone_poddebice}`">
            <PhoneIcon class="hidden sm:inline-block w-4 h-4 rouded-full mr-1" />
            {{ settings.data.phone_poddebice }}
          </a>
        </span>
      </div>
    </div>
  </div>
</template>
