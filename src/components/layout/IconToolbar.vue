<template>
  <div class="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-[#cccccc] select-none shadow-sm">
    <!-- Left: Title -->
    <div class="flex items-center gap-4">
        <!-- Window Controls Placeholder if needed (macOS usually handles this) -->
        <div class="text-xs font-semibold tracking-wide opacity-80 pl-16">bun-codeview <span class="opacity-50">— Task</span></div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1.5">
       <button 
          class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#333] transition-colors text-[11px] text-[#cccccc]"
          :title="$t('toolbar.openAgent')"
        >
          <span>{{ $t('toolbar.openAgent') }}</span>
        </button>
        
        <div class="w-px h-3 bg-[#3e3e3e] mx-1"></div>

        <button 
          @click="toggleSidebar"
          class="p-1.5 rounded hover:bg-[#333] transition-colors"
          :class="sidebarVisible ? 'text-[#fff]' : 'text-[#858585]'"
          :title="$t('toolbar.toggleSidebar') + ' (Ctrl+B)'"
        >
          <PanelLeft :size="15" />
        </button>
        
        <button 
          @click="toggleTheme"
          class="p-1.5 rounded hover:bg-[#333] transition-colors text-[#858585] hover:text-[#fff]"
          :title="theme === 'dark' ? $t('toolbar.toggleTheme.light') : $t('toolbar.toggleTheme.dark')"
        >
          <Sun v-if="theme === 'light'" :size="15" />
          <Moon v-else :size="15" />
        </button>

        <button 
          @click="openProjectDialog"
          class="p-1.5 rounded hover:bg-[#333] transition-colors text-[#858585] hover:text-[#fff]"
          :title="$t('toolbar.openFolder') + ' (Ctrl+O)'"
        >
          <FolderOpen :size="15" />
        </button>

        <button 
          @click="handleAbout"
          class="p-1.5 rounded hover:bg-[#333] transition-colors text-[#858585] hover:text-[#fff]"
          :title="'关于'"
        >
          <Info :size="15" />
        </button>

        <div class="relative">
            <button 
              @click="showSettings = !showSettings"
              class="p-1.5 rounded hover:bg-[#333] transition-colors text-[#858585] hover:text-[#fff]"
              :title="$t('toolbar.settings')"
            >
              <Settings :size="15" />
            </button>
            
            <!-- Settings Dropdown -->
             <div
                v-if="showSettings"
                v-click-outside="() => showSettings = false"
                class="absolute top-full right-0 mt-1 min-w-[200px] bg-[#252525] border border-[#454545] rounded shadow-xl z-50 py-2"
              >
                <div class="px-3 py-1.5 text-xs text-[#858585] font-semibold uppercase tracking-wider">{{ $t('toolbar.fontSize') }}</div>
                <div class="px-3 py-1 flex items-center gap-2 border-b border-[#454545] pb-2 mb-2">
                    <button @click="decreaseFontSize" class="p-1 hover:bg-[#3e3e3e] rounded"><Minus :size="12" /></button>
                    <span class="text-xs w-6 text-center">{{ fileTreeFontSize }}px</span>
                    <button @click="increaseFontSize" class="p-1 hover:bg-[#3e3e3e] rounded"><Plus :size="12" /></button>
                </div>
                
                <div class="px-3 py-1.5 text-xs text-[#858585] font-semibold uppercase tracking-wider">{{ $t('toolbar.language') }}</div>
                <div class="px-3 pb-2 grid grid-cols-2 gap-1 text-[10px]">
                    <button 
                        v-for="lang in ['en', 'zh', 'ru', 'ja', 'fr', 'de']" 
                        :key="lang"
                        @click="appStore.setLocale(lang as any)"
                        class="px-2 py-1 rounded text-left transition-colors"
                        :class="locale === lang ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#3e3e3e] text-[#cccccc]'"
                    >
                        {{ lang.toUpperCase() }}
                    </button>
                </div>
              </div>
        </div>

        <div class="w-px h-3 bg-[#3e3e3e] mx-1"></div>

        <button 
          @click="handleExit"
          class="p-1.5 rounded hover:bg-red-600/20 transition-colors text-[#858585] hover:text-red-400"
          :title="'退出系统'"
        >
          <LogOut :size="15" />
        </button>
    </div>

    <!-- About Dialog -->
    <AboutDialog v-model="showAbout" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { 
  PanelLeft, Sun, Moon, FolderOpen, Settings, 
  Minus, Plus, Info, LogOut
} from 'lucide-vue-next';
import { useLayoutStore } from '../../store/layout';
import { useAppStore } from '../../store/app';
import { useNavStore } from '../../store/navigation';
import AboutDialog from '../AboutDialog.vue';

const { t } = useI18n();
const layoutStore = useLayoutStore();
const appStore = useAppStore();
const navStore = useNavStore();

const { sidebarVisible } = storeToRefs(layoutStore);
const { toggleSidebar } = layoutStore;
const { theme, fileTreeFontSize, locale } = storeToRefs(appStore);

const showSettings = ref(false);
const showAbout = ref(false);

const toggleTheme = () => {
    appStore.setTheme(theme.value === 'dark' ? 'light' : 'dark');
};
// ...

const openProjectDialog = async() => {
    await appStore.openProjectDialog();
    navStore.setActiveView('files');
};

const increaseFontSize = () => {
    if (fileTreeFontSize.value < 20) appStore.setFileTreeFontSize(fileTreeFontSize.value + 1);
};

const decreaseFontSize = () => {
    if (fileTreeFontSize.value > 10) appStore.setFileTreeFontSize(fileTreeFontSize.value - 1);
};

const handleAbout = () => {
    showAbout.value = true;
};

const handleExit = async () => {
    try {
        // 使用 Tauri app API 退出应用
        const { exit } = await import('@tauri-apps/plugin-process');
        await exit(0);
    } catch (error) {
        console.error('Failed to exit application:', error);
        // 备用方案：使用 window close
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.close();
        } catch (e) {
            console.error('Failed to close window:', e);
        }
    }
};

// Simple click outside directive
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
