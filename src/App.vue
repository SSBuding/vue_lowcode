<script setup>
import { provide, ref } from 'vue';
import editor from './packages/editor';
import data from './data.json'
import { registerConfig as config } from './utils/editor-config';
const state = ref(data)

provide('config',config)

</script>

<template>
  <div class="app">
    <editor v-model="state"></editor>
  </div>
</template>

<style lang="scss" scoped>
.app{
  position: fixed;
  top: 20px;
  left: 20px;
  bottom: 20px;
  right: 20px;
}
</style>
