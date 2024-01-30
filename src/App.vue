<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Main from './components/Main.vue';
import Preview from './components/Preview.vue';

</script>

<template>
  <Header></Header>
  <Splitter>
    <SplitterPanel :size="20">
      <Sidebar></Sidebar>
    </SplitterPanel>
    <SplitterPanel :size="60">
      <Main></Main>
    </SplitterPanel>
    <SplitterPanel :size="20">
      <Preview></Preview>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>
