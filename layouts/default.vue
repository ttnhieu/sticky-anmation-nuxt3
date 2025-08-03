<template>
  <div class="theme">
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
