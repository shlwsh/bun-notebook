<template>
  <div 
    class="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased text-[#cccccc]"
    :class="theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1e1e1e] text-[#cccccc]'"
  >
    <!-- Icon Toolbar -->
    <IconToolbar />
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Activity Bar -->
      <ActivityBar />

      <!-- Primary Sidebar -->
      <div
        v-if="sidebarVisible"
        class="flex-shrink-0 transition-all duration-200 relative"
        :style="{ width: `${sidebarWidth}px` }"
        :class="theme === 'light' ? 'border-r border-gray-200 bg-gray-50' : 'bg-[#252526]'"
      >
        <PrimarySidebar @toggle="toggleSidebar" />
        
        <!-- Resize Handle -->
        <div
          class="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/20 transition-colors z-10"
          @mousedown="startSidebarResize"
        />
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden" :class="theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'">
        <!-- Editor Group -->
        <div class="flex-1 overflow-hidden">
          <EditorGroup />
        </div>

        <!-- Status Bar -->
        <StatusBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '../../store/layout';
import { useAppStore } from '../../store/app';
import IconToolbar from './IconToolbar.vue';
import ActivityBar from './ActivityBar.vue';
import PrimarySidebar from './PrimarySidebar.vue';
import EditorGroup from './EditorGroup.vue';
import StatusBar from './StatusBar.vue';

const layoutStore = useLayoutStore();
const appStore = useAppStore();
const { sidebarWidth, sidebarVisible } = storeToRefs(layoutStore);
const { theme } = storeToRefs(appStore);
const { setSidebarWidth, toggleSidebar } = layoutStore;

const startSidebarResize = (e: MouseEvent) => {
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    setSidebarWidth(startWidth + deltaX);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>
