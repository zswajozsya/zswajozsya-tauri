<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Header from './components/Header.vue';
import Toolbar from './components/Toolbar.vue';
import Sidebar from './components/Sidebar.vue';
import Main from './components/Main.vue';
</script>

<template>
  <Header></Header>
  <Toolbar></Toolbar>
  <Splitter>
    <SplitterPanel :size="20">
      <Sidebar></Sidebar>
    </SplitterPanel>
    <SplitterPanel :size="80">
      <Main></Main>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>
