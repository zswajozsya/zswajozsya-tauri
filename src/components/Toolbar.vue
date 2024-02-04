<script setup lang="ts">
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
</script>

<template>
  <Toolbar class="toolbar">
    <template #start>
      <Button
        text
        rounded
        aria-label="Initialize Directory"
        title="Initialize Directory"
      >
        <span class="material-symbols-outlined">enable</span>
      </Button>
    </template>
  </Toolbar>
</template>

<style scoped>
.toolbar {
  padding: 0 6px;
  button {
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
  }
}
</style>
