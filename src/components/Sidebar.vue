<script setup lang="ts">
import Divider from "primevue/divider";
import Button from "primevue/button";

import { usePathStore } from "../stores/path";

const pathStore = usePathStore();
</script>

<template>
  <main v-if="pathStore.common_paths === null"></main>
  <main v-else>
    <div class="dirs">
      <Button @click="pathStore.goTo(pathStore.common_paths.user_dir)" text>
        <span class="material-symbols-outlined">home</span> Home
      </Button>
      <Button
        v-if="pathStore.common_paths.desktop_dir !== null"
        @click="pathStore.goTo(pathStore.common_paths.desktop_dir)"
        text
      >
        <span class="material-symbols-outlined">computer</span>Desktop
      </Button>
      <Button
        v-if="pathStore.common_paths.download_dir !== null"
        @click="pathStore.goTo(pathStore.common_paths.download_dir)"
        text
      >
        <span class="material-symbols-outlined">download</span>Download
      </Button>
      <Button
        v-if="pathStore.common_paths.image_dir !== null"
        @click="pathStore.goTo(pathStore.common_paths.image_dir)"
        text
      >
        <span class="material-symbols-outlined">image</span> Pictures
      </Button>
      <Button
        v-if="pathStore.common_paths.video_dir !== null"
        @click="pathStore.goTo(pathStore.common_paths.video_dir)"
        text
      >
        <span class="material-symbols-outlined">movie</span> Video
      </Button>
      <Button
        v-if="pathStore.common_paths.audio_dir !== null"
        @click="pathStore.goTo(pathStore.common_paths.audio_dir)"
        text
      >
        <span class="material-symbols-outlined">music_note</span> Music
      </Button>
    </div>
    <Divider />
    <div class="disks">
      <Button
        v-for="disk in pathStore.common_paths.disks"
        @click="pathStore.goTo(disk)"
        text
      >
        <span class="material-symbols-outlined">storage</span> {{ disk }}
      </Button>
    </div>
  </main>
</template>

<style scoped>
.dirs, .disks {
  display: flex;
  flex-direction: column;
}

button {
  padding: 8px 8px;
  display: flex;
  align-items: center;
  column-gap: 6px;
}
</style>
