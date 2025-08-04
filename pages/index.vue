x

<template>
  <section class="section section-1">Section 1</section>

  <section class="section-2 parent-container" ref="parentContainer">
    <div class="left-content">Left Column</div>

    <aside class="right-content">
      <div class="sticky-box" ref="stickyBox">
        <div class="right-content__title">This is Tittle</div>
        <div class="right-content__list">
          <div class="right-content__list-item">Image 1</div>
          <div class="right-content__list-item">Image 2</div>
          <div class="right-content__list-item">Image 3</div>
          <div class="right-content__list-item">Image 4</div>
          <div class="right-content__list-item">Image 5</div>
          <div class="right-content__list-item">Image 6</div>
          <div class="right-content__list-item">Image 7</div>
          <div class="right-content__list-item">Image 8</div>
        </div>
      </div>
    </aside>
  </section>

  <section class="section section-3">Section 3</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useStickyBox } from '@/composables/useStickyAnimation';
import { useStickyExpansion } from '@/composables/useStickyExpansion';

// --- Bước 1: Tạo template refs ---
// Các ref này phải có tên khớp với thuộc tính `ref` trong template
const parentContainer = ref<HTMLElement | null>(null);
const stickyBox = ref<HTMLElement | null>(null);

// --- Bước 2: Gọi composable ---
// Truyền các refs và các tùy chọn tùy chỉnh nếu cần
// useStickyBox(stickyBox, parentContainer);
useStickyExpansion(stickyBox, parentContainer);
</script>
