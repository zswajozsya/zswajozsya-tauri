<script setup lang="ts">
import { usePathStore } from "../stores/path";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
import { stringifyPath } from "../utils";

const pathStore = usePathStore();
pathStore.init();

window.addEventListener('mousedown', (e) => {
  if (e.button === 3 && pathStore.path !== null && pathStore.path.length > 1) {
    pathStore.goUp();
  }
})
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
    <Button
      text
      rounded
      class="refresh"
      aria-label="Refresh"
      :disabled="pathStore.path === null"
      @click="pathStore.goTo(pathStore.pathString!)"
    >
      <span class="material-symbols-outlined">refresh</span>
    </Button>
    <div v-if="pathStore.path === null">Loading...</div>
    <div v-else>
      <Breadcrumb
        :home="{
          label: pathStore.path![0],
          command: () => pathStore.goTo(stringifyPath(pathStore.path!.slice(0, 1), 'Dir'))
        }"
        :model="pathStore
          .path!
          .slice(1, pathStore.path.length)
          .map((p, i) => ({
            label: p,
            command: () => pathStore.goTo(stringifyPath(pathStore.path!.slice(0, i + 2), 'Dir'))
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

  .go_up, .refresh {
    width: 42px;
    display: flex;
    justify-content: center;
  }
}
</style>
