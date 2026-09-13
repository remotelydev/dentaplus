<script setup>
import PhoneIcon from '../public/phone.svg'

const settings = useSettings()
const turekTel = computed(() => normalizeTelHref(settings.value?.data.phone_turek))
const poddebiceTel = computed(() => normalizeTelHref(settings.value?.data.phone_poddebice))
</script>

<template>
  <div
    v-if="settings?.data?.phone_turek || settings?.data?.phone_poddebice"
    class="fixed bottom-0 w-full z-50 bg-slate-800 text-white py-2 md:hidden"
  >
    <div class="container mx-auto flex flex-col gap-2 px-3 text-xs xs:text-sm">
      <span class="text-center bold">Umów się na wizytę!</span>
      <div class="flex gap-3 justify-around">
        <span v-if="settings?.data?.phone_turek" class="flex items-center gap-1">
          Turek:
          <a v-if="turekTel" class="flex items-center min-w-0 bg-slate-100 px-2 py-1 text-slate-900 rounded-full whitespace-nowrap" :href="turekTel">
            <PhoneIcon class="w-4 h-4 mr-1" />
            {{ settings.data.phone_turek }}
          </a>
        </span>
        <span v-if="settings?.data?.phone_poddebice" class="flex items-center gap-1">
          Poddębice:
          <a v-if="poddebiceTel" class="flex items-center min-w-0 bg-slate-100 px-2 py-1 text-slate-900 rounded-full whitespace-nowrap" :href="poddebiceTel">
            <PhoneIcon class="w-4 h-4 mr-1" />
            {{ settings.data.phone_poddebice }}
          </a>
        </span>
      </div>
    </div>
  </div>
</template>
