<template>
  <div class="h-7 bg-[#3c3c3c] border-b border-[#2b2b2b] flex items-center px-2 text-[11px] text-[#cccccc] select-none">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="relative"
      @mouseenter="handleMenuHover(menu.id)"
      @mouseleave="handleMenuLeave"
    >
      <button
        @click="toggleMenu(menu.id)"
        :class="[
          'px-2 py-1 rounded hover:bg-[#505050] transition-colors',
          activeMenu === menu.id ? 'bg-[#505050]' : ''
        ]"
      >
        {{ menu.label }}
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="activeMenu === menu.id"
        class="absolute top-full left-0 mt-0.5 min-w-[200px] bg-[#252525] border border-[#454545] rounded shadow-xl z-50 py-1"
      >
        <button
          v-for="item in menu.items"
          :key="item.id"
          @click="handleMenuItemClick(item)"
          :disabled="item.disabled"
          :class="[
            'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#2a2d2e] transition-colors',
            item.disabled ? 'text-[#6a6a6a] cursor-not-allowed' : 'text-[#cccccc]'
          ]"
        >
          <div class="flex items-center gap-2">
            <component v-if="item.icon" :is="item.icon" :size="14" />
            <span>{{ item.label }}</span>
          </div>
          <span v-if="item.shortcut" class="text-[10px] text-[#858585]">{{ item.shortcut }}</span>
        </button>
        
        <div v-if="menu.items.some(i => i.separator)" class="h-px bg-[#454545] my-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen, FileText, HelpCircle, RefreshCw } from 'lucide-vue-next';
import { useAppStore } from '../../store/app';
import { useNavStore } from '../../store/navigation';

const appStore = useAppStore();
const navStore = useNavStore();

const activeMenu = ref<string | null>(null);

const menus = [
  {
    id: 'file',
    label: '文件',
    items: [
      { id: 'open-folder', label: '打开文件夹...', icon: FolderOpen, shortcut: 'Ctrl+O', action: 'openFolder' },
      { id: 'separator-1', separator: true },
      { id: 'refresh', label: '刷新', icon: RefreshCw, shortcut: 'Ctrl+R', action: 'refresh', disabled: true },
    ]
  },
  {
    id: 'view',
    label: '查看',
    items: [
      { id: 'toggle-sidebar', label: '切换侧边栏', shortcut: 'Ctrl+B', action: 'toggleSidebar' },
    ]
  },
  {
    id: 'help',
    label: '帮助',
    items: [
      { id: 'about', label: '关于', icon: HelpCircle, action: 'about' },
    ]
  },
];

const toggleMenu = (menuId: string) => {
  activeMenu.value = activeMenu.value === menuId ? null : menuId;
};

const handleMenuHover = (menuId: string) => {
  if (activeMenu.value) {
    activeMenu.value = menuId;
  }
};

const handleMenuLeave = () => {};

const handleMenuItemClick = (item: any) => {
  if (item.disabled) return;
  activeMenu.value = null;
  
  switch (item.action) {
    case 'openFolder':
      appStore.openProjectDialog();
      navStore.setActiveView('files');
      break;
    case 'toggleSidebar':
      // Implemented in AppLayout
      break;
    case 'about':
      alert('Bun Markdown Editor v0.1.0\n专注于 MD 文件的查看与编辑');
      break;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      activeMenu.value = null;
    }
  });
}
</script>
