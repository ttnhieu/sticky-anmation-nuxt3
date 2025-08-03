<template>
  <div class="theme2">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
</script>
