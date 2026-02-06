<template>
  <footer class="h-6 bg-[#007acc] border-t border-[#2b2b2b] flex items-center justify-between px-3 text-[10px] text-white shrink-0">
    <!-- Left Section -->
    <div class="flex items-center gap-3">
      <!-- Project Path -->
      <div 
        v-if="projectPath" 
        class="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        :title="projectPath"
      >
        <Folder :size="12" />
        <span class="font-medium">{{ projectPath.split('/').pop() }}</span>
      </div>
      
      <!-- Git Branch (placeholder) -->
      <div class="flex items-center gap-1 opacity-75 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
        <GitBranch :size="11" />
        <span>main</span>
      </div>
      
      <!-- Separator -->
      <div class="h-3 w-px bg-white/20"></div>
      
      <!-- Open Tabs Count -->
      <div 
        v-if="tabs.length > 0"
        class="flex items-center gap-1 opacity-75 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors"
        :title="`${tabs.length} 个打开的文件`"
      >
        <FileText :size="11" />
        <span>{{ tabs.length }} 个文件</span>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors"
        :title="`切换到${theme === 'dark' ? '浅色' : '深色'}主题`"
      >
        <Sun v-if="theme === 'dark'" :size="11" />
        <Moon v-else :size="11" />
        <span>{{ theme === 'dark' ? '深色' : '浅色' }}</span>
      </button>
      
      <!-- Language -->
      <div 
        class="flex items-center gap-1 opacity-75 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        :title="'语言设置'"
      >
        <Languages :size="11" />
        <span>{{ localeNames[locale] }}</span>
      </div>
      
      <!-- Separator -->
      <div class="h-3 w-px bg-white/20"></div>
      
      <!-- App Name -->
      <span class="opacity-75">MD Notebook</span>
      
      <!-- Separator -->
      <div class="h-3 w-px bg-white/20"></div>
      
      <!-- Version with Changelog -->
      <div 
        class="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        @click="showChangelog = !showChangelog"
        :title="'点击查看更新日志'"
      >
        <Info :size="11" />
        <span class="font-medium">{{ version }}</span>
      </div>
    </div>
    
    <!-- Changelog Modal -->
    <Teleport to="body">
      <div 
        v-if="showChangelog" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
        @click="showChangelog = false"
      >
        <div 
          class="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
          @click.stop
        >
          <div class="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">版本更新日志</h3>
            <button 
              @click="showChangelog = false"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <X :size="20" />
            </button>
          </div>
          
          <div class="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div 
              v-for="(entry, index) in changelog" 
              :key="entry.version"
              class="mb-4 pb-4"
              :class="{ 'border-b border-gray-700': index < changelog.length - 1 }"
            >
              <div class="flex items-center gap-3 mb-2">
                <span class="font-mono text-sm font-semibold text-blue-400">
                  {{ entry.version }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ entry.date }}
                </span>
              </div>
              <p class="text-sm text-gray-300">{{ entry.changes }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../../store/app';
import { useNavStore } from '../../store/navigation';
import { Folder, GitBranch, Info, X, FileText, Sun, Moon, Languages } from 'lucide-vue-next';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string;
}

interface VersionInfo {
  version: string;
  changelog: ChangelogEntry[];
}

const appStore = useAppStore();
const navStore = useNavStore();
const { projectPath, theme, locale } = storeToRefs(appStore);
const { tabs } = storeToRefs(navStore);

const version = ref('Ver:1.0.20260206.002');
const changelog = ref<ChangelogEntry[]>([]);
const showChangelog = ref(false);

const localeNames: Record<string, string> = {
  en: 'EN',
  zh: '中文',
  ru: 'RU',
  ja: '日本語',
  fr: 'FR',
  de: 'DE'
};

const toggleTheme = () => {
  appStore.setTheme(theme.value === 'dark' ? 'light' : 'dark');
};

onMounted(async () => {
  try {
    const response = await fetch('/version.json');
    const data: VersionInfo = await response.json();
    version.value = data.version;
    changelog.value = data.changelog;
  } catch (error) {
    console.error('Failed to load version info:', error);
  }
});
</script>
