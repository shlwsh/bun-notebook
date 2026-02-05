<template>
  <div 
    class="flex flex-col items-center py-3 gap-2 bg-[#181818] border-r border-[#2b2b2b] w-12"
    style="width: 48px;"
  >
    <!-- Logo -->
    <div class="w-8 h-8 mb-2 flex items-center justify-center">
      <FileText :size="20" class="text-blue-500" />
    </div>

    <!-- Activity Items -->
    <button
      v-for="item in activityItems"
      :key="item.id"
      @click="handleActivityClick(item.id)"
      :class="[
        'w-12 h-12 flex items-center justify-center relative group transition-colors',
        activeView === item.id ? 'text-white' : 'text-[#858585] hover:text-white'
      ]"
      :title="item.label"
    >
      <component :is="item.icon" :size="24" />
      <div 
        v-if="activeView === item.id" 
        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useNavStore } from '../../store/navigation';
import { FileText, Files, Search } from 'lucide-vue-next';

const { t } = useI18n();
const navStore = useNavStore();
const { activeView } = storeToRefs(navStore);

const activityItems = computed(() => [
  { id: 'files', label: t('activityBar.explorer'), icon: Files },
  { id: 'search', label: t('activityBar.search'), icon: Search },
]);

const handleActivityClick = (viewId: string) => {
  navStore.setActiveView(viewId as any);
};
</script>
