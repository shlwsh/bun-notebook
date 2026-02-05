<template>
  <div class="flex flex-col h-full bg-[#1e1e1e]">
    <div class="p-4 border-b border-[#2b2b2b]">
      <div class="relative group">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('search.placeholder')"
          class="w-full bg-[#252525] border border-[#3e3e3e] rounded px-8 py-1.5 text-xs text-[#cccccc] focus:outline-none focus:border-blue-500 transition-all"
          @keyup.enter="handleSearch"
        />
        <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585] group-focus-within:text-blue-500" />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''; results = []"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-white"
        >
          <X :size="14" />
        </button>
      </div>
      <div class="mt-2 text-[10px] text-[#858585] flex justify-between items-center">
        <span>{{ $t('search.hint') }}</span>
        <span v-if="results.length > 0">{{ $t('search.count', { count: results.length }) }}</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="isSearching" class="flex flex-col items-center justify-center h-40 gap-3 opacity-50">
        <RefreshCw :size="24" class="animate-spin text-blue-500" />
        <span class="text-xs">{{ $t('search.searching') }}</span>
      </div>

      <div v-else-if="results.length === 0 && hasSearched" class="flex flex-col items-center justify-center h-40 opacity-40">
        <span class="text-xs">{{ $t('search.noResults', { query: lastQuery }) }}</span>
      </div>

      <div v-else class="divide-y divide-[#2b2b2b]">
        <div v-for="result in results" :key="result.path" class="p-2 hover:bg-[#2a2a2a] transition-colors">
          <button 
            @click="openFile(result)"
            class="w-full text-left"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <FileText :size="14" class="text-blue-400" />
              <span class="text-xs font-semibold text-[#cccccc] truncate">{{ result.name }}</span>
            </div>
            
            <div class="space-y-1 pl-5 border-l border-[#3e3e3e] ml-1.5">
              <div 
                v-for="(match, idx) in result.matches.slice(0, 3)" 
                :key="idx"
                class="text-[10px] text-[#858585] truncate hover:text-[#cccccc]"
              >
                <span class="text-blue-500/50 mr-1">{{ match.lineNumber + 1 }}:</span>
                <span v-html="highlight(match.content)"></span>
              </div>
              <div v-if="result.matches.length > 3" class="text-[9px] text-[#555] italic">
                {{ $t('search.moreMatches', { count: result.matches.length - 3 }) }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Search, X, RefreshCw, FileText } from 'lucide-vue-next';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from '../../store/app';
import { useNavStore } from '../../store/navigation';

interface SearchMatch {
    lineNumber: number;
    content: string;
}

interface SearchResult {
    path: string;
    name: string;
    matches: SearchMatch[];
}

const { t } = useI18n();
const appStore = useAppStore();
const navStore = useNavStore();
const searchQuery = ref('');
const results = ref<SearchResult[]>([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const lastQuery = ref('');

const highlight = (content: string) => {
    if (!searchQuery.value) return content;
    const regex = new RegExp(`(${searchQuery.value})`, 'gi');
    return content.replace(regex, '<span class="text-blue-400 bg-blue-400/10">$1</span>');
};

const handleSearch = async () => {
    if (!searchQuery.value.trim() || !appStore.projectPath) return;
    
    isSearching.value = true;
    hasSearched.value = true;
    lastQuery.value = searchQuery.value;
    
    try {
        const res: SearchResult[] = await invoke('search_content', {
            root_path: appStore.projectPath,
            query: searchQuery.value
        });
        results.value = res;
    } catch (error) {
        console.error(t('errors.searchFail', { error }));
    } finally {
        isSearching.value = false;
    }
};

const openFile = (result: SearchResult) => {
    navStore.openTab({
        id: `file-${result.path}`,
        title: result.name,
        path: result.path,
        icon: 'file'
    });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border-radius: 2px;
}
</style>
