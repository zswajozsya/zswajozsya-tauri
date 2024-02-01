<script setup lang="ts">
import { usePathStore } from "../stores/index.ts";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
import { stringifyPath } from "../utils";

const pathStore = usePathStore();
pathStore.init();
</script>

<template>
  <div class="root">
    <Button
      text
      rounded
      class="go_up"
      aria-label="Go up"
      :disabled="pathStore.path === null || pathStore.path.length === 1"
      @click="pathStore.goUp()"
    >
      <span class="material-symbols-outlined">arrow_upward</span>
    </Button>
    <div v-if="pathStore.path === null">Loading...</div>
    <div v-else>
      <Breadcrumb
        :home="{
          label: pathStore.path![0],
          command: () => pathStore.goTo(stringifyPath(pathStore.path!.slice(0, 1)))
        }"
        :model="pathStore
          .path!
          .slice(1, pathStore.path.length)
          .map((p, i) => ({
            label: p,
            command: () => pathStore.goTo(stringifyPath(pathStore.path!.slice(0, i + 2)))
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
  padding: 0 6px;

  .go_up {
    width: 42px;
    display: flex;
    justify-content: center;
  }
}
</style>
