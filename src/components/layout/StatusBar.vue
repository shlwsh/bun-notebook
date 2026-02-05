<template>
  <footer class="h-6 bg-[#007acc] border-t border-[#2b2b2b] flex items-center justify-between px-3 text-[10px] text-white shrink-0">
    <div class="flex items-center gap-4">
      <div v-if="projectPath" class="flex items-center gap-1.5">
        <Folder :size="12" />
        <span class="font-medium">{{ projectPath.split('/').pop() }}</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <span>BUN MARKDOWN EDITOR</span>
        <span class="opacity-50">v0.1.0</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '../../store/app';
import { Folder } from 'lucide-vue-next';

const store = useAppStore();
const { projectPath } = storeToRefs(store);
</script>
