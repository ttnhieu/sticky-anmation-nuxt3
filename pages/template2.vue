<template>
  <section class="section section-1">Section 1</section>

  <div class="flex flex-col items-start gap-12 md:flex-row md:gap-24">
    <div
      class="w-full md:w-auto md:flex-auto lg:max-w-[856px] h-[2000px] bg-green-100"
    >
      GameTable
    </div>
    <div
      class="hidden md:block md:w-[300px] md:flex-[0_0_auto] lg:w-[420px] bg-indigo-400"
    >
      GameFocusInfo
    </div>
  </div>

  <section class="section section-3">Section 3</section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'template2' // Tên layout khớp với tên file (không có .vue)
});
</script>
