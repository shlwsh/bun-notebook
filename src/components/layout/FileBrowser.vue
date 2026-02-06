<template>
  <div class="h-full flex flex-col bg-[#1e1e1e]">
    <!-- File Tree Header -->
    <div class="h-9 flex items-center justify-between px-3 border-b border-[#2b2b2b] bg-[#252525] shrink-0">
      <span class="text-[11px] font-bold text-[#969696] uppercase tracking-wider truncate mr-2">
        {{ currentFolder || $t('explorer.title') }}
      </span>
      <div class="flex items-center gap-1">
        <button
          @click="showMdOnly = !showMdOnly"
          class="p-1 rounded transition-colors"
          :class="showMdOnly ? 'bg-blue-600 text-white' : 'hover:bg-[#2a2a2a] text-[#858585] hover:text-white'"
          :title="$t('explorer.filterMd')"
        >
          <Filter :size="14" />
        </button>
        <button
          @click="handleExpandAll"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.expandAll')"
        >
          <ChevronsDown :size="14" />
        </button>
        <button
          @click="handleCollapseAll"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.collapseAll')"
        >
          <ChevronsUp :size="14" />
        </button>
        <div class="w-px h-3 bg-[#3e3e3e] mx-1"></div>
        <button
          @click="showNewFileInput = !showNewFileInput; showNewFolderInput = false"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.newFile')"
        >
          <FilePlus :size="14" />
        </button>
        <button
          @click="showNewFolderInput = !showNewFolderInput; showNewFileInput = false"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.newFolder')"
        >
          <FolderPlus :size="14" />
        </button>
        <button
          @click="loadFileTree"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.refresh')"
        >
          <RefreshCw :size="14" :class="loading ? 'animate-spin' : ''" />
        </button>
        <button
          @click="handleOpenFolder"
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
          :title="$t('explorer.openFolder')"
        >
          <FolderOpen :size="14" />
        </button>
      </div>
    </div>

    <!-- New File Input -->
    <div v-if="showNewFileInput" class="px-2 py-2 border-b border-[#2b2b2b] bg-[#252525] animate-in slide-in-from-top duration-200">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input 
            v-model="newFileName"
            @keyup.enter="handleCreateFile"
            @keyup.esc="showNewFileInput = false"
            ref="newFileRef"
            type="text"
            :placeholder="$t('explorer.fileNamePlaceholder')"
            class="w-full bg-[#1e1e1e] border border-blue-500/50 rounded px-2 py-1 text-[11px] text-[#cccccc] outline-none"
          />
        </div>
        <button @click="handleCreateFile" class="text-blue-400 hover:text-blue-300 text-[10px] font-bold">{{ $t('explorer.create') }}</button>
        <button @click="showNewFileInput = false" class="text-[#6a6a6a] hover:text-white"><X :size="12" /></button>
      </div>
    </div>

    <!-- New Folder Input -->
    <div v-if="showNewFolderInput" class="px-2 py-2 border-b border-[#2b2b2b] bg-[#252525] animate-in slide-in-from-top duration-200">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input 
            v-model="newFolderName"
            @keyup.enter="handleCreateFolder"
            @keyup.esc="showNewFolderInput = false"
            ref="newFolderRef"
            type="text"
            :placeholder="$t('explorer.folderNamePlaceholder')"
            class="w-full bg-[#1e1e1e] border border-blue-500/50 rounded px-2 py-1 text-[11px] text-[#cccccc] outline-none"
          />
        </div>
        <button @click="handleCreateFolder" class="text-blue-400 hover:text-blue-300 text-[10px] font-bold">{{ $t('explorer.create') }}</button>
        <button @click="showNewFolderInput = false" class="text-[#6a6a6a] hover:text-white"><X :size="12" /></button>
      </div>
    </div>

    <!-- Search Area -->
    <div class="px-2 py-2 border-b border-[#2b2b2b] bg-[#1e1e1e] shrink-0">
      <div class="relative group">
        <Search :size="12" class="absolute left-2.5 top-2 text-[#858585] group-focus-within:text-blue-400 transition-colors" />
        <input 
          v-model="searchQuery"
          type="text"
          :placeholder="$t('explorer.searchPlaceholder')"
          class="w-full bg-[#252525] border border-[#3e3e3e] focus:border-blue-500 rounded px-8 py-1.5 text-[11px] text-[#cccccc] outline-none transition-all placeholder:text-[#6a6a6a]"
        />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''"
          class="absolute right-2 top-2 text-[#858585] hover:text-white"
        >
          <X :size="12" />
        </button>
      </div>
    </div>

    <!-- File Tree Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-1">
      <!-- Loading State -->
      <div v-if="loading && !fileTree.length" class="flex flex-col items-center justify-center h-32 text-[#6a6a6a] text-xs">
        <RefreshCw :size="24" class="mb-2 animate-spin opacity-50" />
        <p>{{ $t('explorer.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center p-4 text-red-400 text-xs text-center text-balance">
        <AlertCircle :size="24" class="mb-2" />
        <p>{{ error || $t('explorer.error') }}</p>
        <button @click="loadFileTree" class="mt-2 text-blue-400 hover:underline">{{ $t('explorer.retry') }}</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredFileTree.length && !loading" class="flex flex-col items-center justify-center h-32 text-[#6a6a6a] text-xs text-center px-4">
        <Folder v-if="!searchQuery" :size="24" class="mb-2 opacity-50" />
        <Search v-else :size="24" class="mb-2 opacity-50" />
        <p>{{ searchQuery ? $t('explorer.emptySearch') : $t('explorer.emptyFolder') }}</p>
        <button v-if="!searchQuery" @click="handleOpenFolder" class="mt-2 text-blue-400 hover:underline text-[10px]">{{ $t('explorer.selectFolder') }}</button>
      </div>
      
      <FileTreeNode
        v-for="node in filteredFileTree"
        :key="node.path"
        :node="node"
        :depth="0"
        :search-query="searchQuery"
        :expand-trigger="expandTrigger"
        :collapse-trigger="collapseTrigger"
        :font-size="fileTreeFontSize"
        @select="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { 
  Folder, FolderOpen, RefreshCw, AlertCircle, 
  Search, X, FilePlus, FolderPlus, Filter,
  ChevronsDown, ChevronsUp 
} from 'lucide-vue-next';
import { useAppStore } from '../../store/app';
import { useNavStore } from '../../store/navigation';
import FileTreeNode from './FileTreeNode.vue';
import { invoke } from '@tauri-apps/api/core';

const { t } = useI18n();
const appStore = useAppStore();
const navStore = useNavStore();
const { projectPath, fileTreeFontSize } = storeToRefs(appStore);

const expandTrigger = ref(0);
const collapseTrigger = ref(0);

const handleExpandAll = () => {
    expandTrigger.value++;
};

const handleCollapseAll = () => {
    collapseTrigger.value++;
};

const searchQuery = ref('');

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const fileTree = ref<FileNode[]>([]);
const loading = ref(false);
const error = ref('');
const showNewFileInput = ref(false);
const newFileName = ref('');
const showNewFolderInput = ref(false);
const newFolderName = ref('');
const showMdOnly = ref(false);

const handleCreateFile = async () => {
    if (!newFileName.value.trim() || !projectPath.value) return;
    
    let name = newFileName.value.trim();
    if (!name.endsWith('.md')) {
        name += '.md';
    }
    
    const fullPath = `${projectPath.value}/${name}`;
    
    try {
        await invoke('create_new_file', { path: fullPath });
        showNewFileInput.value = false;
        newFileName.value = '';
        await loadFileTree();
        
        // Auto open the new file
        handleFileSelect(fullPath);
    } catch (err: any) {
        error.value = t('errors.createFail', { error: err });
    }
};

const handleCreateFolder = async () => {
    if (!newFolderName.value.trim() || !projectPath.value) return;
    
    const name = newFolderName.value.trim();
    const fullPath = `${projectPath.value}/${name}`;
    
    try {
        await invoke('create_dir', { path: fullPath });
        showNewFolderInput.value = false;
        newFolderName.value = '';
        await loadFileTree();
    } catch (err: any) {
        error.value = t('errors.createFolderFail', { error: err });
    }
};

const filteredFileTree = computed(() => {
  const query = searchQuery.value.toLowerCase();
  
  // 支持的文件扩展名
  const supportedExtensions = ['md', 'markdown', 'ts', 'tsx', 'js', 'jsx', 'txt', 'log', 'json'];
  
  const filterNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.reduce((acc: FileNode[], node) => {
      // 1. Filter by MD only if enabled
      let isVisible = true;
      if (showMdOnly.value && !node.isDirectory) {
          isVisible = node.name.toLowerCase().endsWith('.md');
      } else if (!node.isDirectory) {
          // 检查是否为支持的文件类型
          const ext = node.name.split('.').pop()?.toLowerCase();
          isVisible = ext ? supportedExtensions.includes(ext) : false;
      }
      
      // 2. Filter by Search Query
      let matchesSearch = true;
      if (query) {
          matchesSearch = node.name.toLowerCase().includes(query);
      }
      
      if (node.isDirectory && node.children) {
        const filteredChildren = filterNodes(node.children);
        
        let keepDir = false;
        if (showMdOnly.value) {
            keepDir = filteredChildren.length > 0;
            if (query && matchesSearch && filteredChildren.length > 0) keepDir = true;
        } else {
            keepDir = filteredChildren.length > 0 || matchesSearch;
        }
        
        if (keepDir) {
           acc.push({ ...node, children: filteredChildren });
        }
      } else if (isVisible && matchesSearch) {
        acc.push(node);
      }
      
      return acc;
    }, []);
  };
  
  if (!searchQuery.value && !showMdOnly.value) return fileTree.value;
  
  return filterNodes(fileTree.value);
});


const currentFolder = computed(() => {
  if (!projectPath.value) return '';
  return projectPath.value.split('/').pop() || '';
});

const handleOpenFolder = async () => {
  await appStore.openProjectDialog();
  if (projectPath.value) {
    await loadFileTree();
  }
};

const loadFileTree = async () => {
  if (!projectPath.value) {
    console.log('FileBrowser: No project path set, skipping load');
    return;
  }
  
  loading.value = true;
  error.value = '';
  console.log('FileBrowser: Calling read_directory_tree for:', projectPath.value);
  
  try {
    const tree: FileNode[] = await invoke('read_directory_tree', { path: projectPath.value });
    console.log('FileBrowser: Received tree results, count:', tree.length);
    fileTree.value = tree;
    if (tree.length === 0) {
      console.warn('FileBrowser: Tree is empty');
    }
  } catch (err: any) {
    console.error('FileBrowser: Failed to load file tree:', err);
    error.value = t('errors.loadFail', { error: err });
  } finally {
    loading.value = false;
  }
};

const handleFileSelect = (filePath: string) => {
  console.log('File selected:', filePath);
  
  // Generate unique ID based on file path
  const fileId = `file-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  // Open file in new tab
  navStore.openTab({
    id: fileId,
    title: filePath.split('/').pop() || 'Untitled',
    path: filePath,
    icon: 'file',
  });
  
  console.log('Tab opened with ID:', fileId);
};

onMounted(() => {
  if (projectPath.value) {
    loadFileTree();
  }
  window.addEventListener('refresh-file-tree', loadFileTree);
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('refresh-file-tree', loadFileTree);
});

watch(projectPath, (newPath) => {
  if (newPath) {
    loadFileTree();
  } else {
    fileTree.value = [];
  }
});
</script>
