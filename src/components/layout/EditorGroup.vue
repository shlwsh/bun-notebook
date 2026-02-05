<template>
  <div class="flex flex-col h-full bg-[#1e1e1e]">
    <!-- Tab Bar -->
    <div 
      class="h-9 flex items-center bg-[#252525] border-b border-[#2b2b2b] overflow-x-auto custom-scrollbar"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div
        v-for="tab in tabs"
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        @contextmenu.prevent="handleContextMenu($event, tab)"
        :class="[
          'flex items-center gap-2 px-3 h-full text-xs cursor-pointer border-r border-[#2b2b2b] min-w-[120px] max-w-[200px] group transition-all',
          activeTabId === tab.id 
            ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' 
            : 'text-[#969696] hover:text-white hover:bg-[#2a2a2a]'
        ]"
      >
        <FileText :size="14" class="shrink-0 text-blue-400" />
        <span class="truncate flex-1">{{ tab.title }}</span>
        <X
          v-if="tab.closable"
          :size="14"
          class="shrink-0 opacity-40 hover:opacity-100 hover:bg-[#3e3e3e] rounded p-0.5 transition-all"
          @click.stop="closeTab(tab.id)"
        />
      </div>
    </div>

    <!-- Context Menu -->
    <Teleport to="body">
      <div 
        v-if="contextMenu.visible"
        class="fixed z-[9999] bg-[#252525] border border-[#3e3e3e] rounded-md shadow-2xl py-1 min-w-[160px] animate-in fade-in zoom-in duration-100"
        :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
        v-click-outside="closeContextMenu"
      >
        <button 
          @click="handleMenuAction('closeCurrent')"
          class="w-full text-left px-3 py-1.5 text-xs text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <X :size="12" />
          <span>{{ $t('editor.closeCurrent') }}</span>
        </button>
        <button 
          @click="handleMenuAction('closeOthers')"
          class="w-full text-left px-3 py-1.5 text-xs text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <div class="w-3" />
          <span>{{ $t('editor.closeOthers') }}</span>
        </button>
        <button 
          @click="handleMenuAction('closeAll')"
          class="w-full text-left px-3 py-1.5 text-xs text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <div class="w-3" />
          <span>{{ $t('editor.closeAll') }}</span>
        </button>
      </div>
    </Teleport>

    <!-- Editor Content -->
    <div class="flex-1 overflow-hidden relative">
      <div v-if="!activeTabId" class="flex flex-col items-center justify-center h-full text-[#3e3e3e] select-none">
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-blue-500 blur-[60px] opacity-10 rounded-full animate-pulse"></div>
          <FileText :size="100" class="relative z-10 opacity-30" stroke-width="0.5" />
        </div>
        <h2 class="text-xl font-light tracking-widest text-[#666666] mb-2">{{ $t('editor.title') }}</h2>
        <p class="text-sm opacity-50">{{ $t('editor.subtitle') }}</p>
        <div class="mt-8 flex gap-4 opacity-40 text-xs text-nowrap">
          <div class="px-2 py-1 border border-[#2b2b2b] rounded">{{ $t('editor.saveShortcut') }}</div>
          <div class="px-2 py-1 border border-[#2b2b2b] rounded">{{ $t('editor.tableShortcut') }}</div>
        </div>
      </div>
      <FileViewer v-else :key="activeTabId" :filePath="activeTabPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useNavStore } from '../../store/navigation';
import { X, FileText } from 'lucide-vue-next';
import FileViewer from '../FileViewer.vue';

const { t } = useI18n();
const navStore = useNavStore();
const { tabs, activeTabId } = storeToRefs(navStore);
const { setActiveTab, closeTab } = navStore;

const activeTabPath = computed(() => {
  const activeTab = tabs.value.find(t => t.id === activeTabId.value);
  return activeTab ? activeTab.path : '';
});

const contextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  tab: any | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  tab: null
});

const handleContextMenu = (event: MouseEvent, tab: any) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    tab
  };
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

const handleMenuAction = (action: 'closeCurrent' | 'closeOthers' | 'closeAll') => {
  if (!contextMenu.value.tab) return;
  const tabId = contextMenu.value.tab.id;
  
  switch (action) {
    case 'closeCurrent': closeTab(tabId); break;
    case 'closeOthers': navStore.closeOtherTabs(tabId); break;
    case 'closeAll': navStore.closeAllTabs(); break;
  }
  closeContextMenu();
};

const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('mousedown', el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener('mousedown', el.clickOutsideEvent);
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
