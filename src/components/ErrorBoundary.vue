<template>
  <div v-if="error" class="p-8 bg-red-900/20 border border-red-500/50 rounded-xl m-6">
    <h2 class="text-red-400 font-bold mb-2">{{ $t('errors.componentError') }}</h2>
    <p class="text-slate-400 text-xs font-mono">{{ error }}</p>
    <button @click="error = null" class="mt-4 px-4 py-2 bg-slate-800 rounded text-xs">{{ $t('errors.retry') }}</button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const error = ref<string | null>(null);

onErrorCaptured((err) => {
  error.value = err.message;
  return false;
});
</script>
