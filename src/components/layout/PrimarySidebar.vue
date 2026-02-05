<template>
  <div class="flex h-full bg-[#1e1e1e] border-r border-[#2b2b2b] overflow-hidden">
    <div class="flex flex-col w-full">
      <!-- Sidebar Header -->
      <div class="h-9 flex items-center justify-between px-4 border-b border-[#2b2b2b] bg-[#252525]">
        <span class="text-xs font-semibold text-[#cccccc] uppercase tracking-wider">
          {{ activeView === 'search' ? $t('activityBar.search') : $t('activityBar.explorer') }}
        </span>
        <button
          @click="$emit('toggle')"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Sidebar Content -->
      <div class="flex-1 overflow-hidden">
        <FileBrowser v-if="activeView === 'files'" />
        <FileSearch v-else-if="activeView === 'search'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useNavStore } from '../../store/navigation';
import { X } from 'lucide-vue-next';
import FileBrowser from './FileBrowser.vue';
import FileSearch from './FileSearch.vue';

defineEmits(['toggle']);

const navStore = useNavStore();
const { activeView } = storeToRefs(navStore);
</script>
