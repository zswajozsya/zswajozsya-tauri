<script setup lang="ts">
import { useUrlStore } from "../stores/index.ts";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";

const urlStore = useUrlStore();
urlStore.init();
</script>

<template>
  <div class="root">
    <Button
      :disabled="urlStore.value === null || urlStore.value.length === 1"
      @click="urlStore.value!.pop()"
    >
      <span class="material-symbols-outlined">arrow_upward</span>
    </Button>
    <div v-if="urlStore.value === null">Loading...</div>
    <div v-else>
      <Breadcrumb
        :home="{
          label: 'C:',
          command: () => urlStore.value = [urlStore.value![0]]
        }"
        :model="urlStore
          .value!
          .slice(1, urlStore.value.length)
          .map((p, i) => ({
            label: p,
            command: () => urlStore.value = urlStore.value!.slice(0, i + 2)
          }))"
      >
      </Breadcrumb>
    </div>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  align-items: center;
}
</style>
