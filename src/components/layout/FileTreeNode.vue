<template>
  <div
    :style="{ paddingLeft: `${depth * 12}px` }"
    class="select-none"
  >
    <div
      @click="handleSingleClick"
      @dblclick="handleDoubleClick"
      @contextmenu.prevent="handleContextMenu"
      :style="{ fontSize: `${fontSize}px` }"
      :class="[
        'flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors group relative',
        'hover:bg-[#2a2a2a] active:bg-[#37373d]',
        isRenaming ? 'bg-[#37373d]' : '',
        getNodeColor()
      ]"
    >
      <ChevronRight
        v-if="node.isDirectory"
        :size="14"
        :class="['transition-transform text-[#858585] group-hover:text-white', expanded ? 'rotate-90' : '']"
      />
      <span v-else class="w-3.5" />
      
      <component
        :is="getIcon()"
        :size="16"
        :class="[getIconColor(), 'shrink-0']"
      />
      
      <div class="flex-1 truncate flex items-center">
        <input
          v-if="isRenaming"
          v-model="tempName"
          @keyup.enter="confirmRename"
          @keyup.esc="isRenaming = false"
          @blur="confirmRename"
          ref="renameInput"
          class="bg-[#1e1e1e] border border-blue-500 rounded px-1 w-full outline-none text-[#cccccc]"
        />
        <template v-else-if="searchQuery && !node.isDirectory">
          <span v-for="(part, i) in getHighlightedName()" :key="i" :class="part.isMatch ? 'bg-yellow-500/30 text-yellow-200 rounded-sm' : ''">
            {{ part.text }}
          </span>
        </template>
        <span v-else>{{ node.name }}</span>
      </div>

      <div 
        v-if="showContextMenu"
        v-click-outside="() => showContextMenu = false"
        class="fixed bg-[#252525] border border-[#3e3e3e] rounded shadow-xl py-1 z-[1000] min-w-[120px]"
        :style="{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }"
      >
        <button @click="startRename" class="w-full text-left px-3 py-1.5 hover:bg-blue-600 flex items-center gap-2 group/item">
          <Edit2 :size="12" class="text-[#858585] group-hover/item:text-white" />
          <span>{{ $t('contextMenu.rename') }}</span>
        </button>
        
        <div class="h-px bg-[#3e3e3e] my-1"></div>

        <button @click="handleCopyToClipboard" class="w-full text-left px-3 py-1.5 hover:bg-blue-600 flex items-center gap-2 group/item">
          <Copy :size="12" class="text-[#858585] group-hover/item:text-white" />
          <span>{{ $t('contextMenu.copy') }}</span>
        </button>
        <button 
          v-if="clipboardPath" 
          @click="handlePaste" 
          class="w-full text-left px-3 py-1.5 hover:bg-blue-600 flex items-center gap-2 group/item"
        >
          <Clipboard :size="12" class="text-[#858585] group-hover/item:text-white" />
          <span>{{ $t('contextMenu.paste') }}</span>
        </button>
        <button @click="handleDuplicate" class="w-full text-left px-3 py-1.5 hover:bg-blue-600 flex items-center gap-2 group/item">
          <Copy :size="12" class="text-[#858585] group-hover/item:text-white" />
          <span>{{ $t('contextMenu.duplicate') }}</span>
        </button>
        
        <div class="h-px bg-[#3e3e3e] my-1"></div>
        
        <button @click="handleDelete" class="w-full text-left px-3 py-1.5 hover:bg-red-600 flex items-center gap-2 group/item">
          <Trash2 :size="12" class="text-[#858585] group-hover/item:text-white" />
          <span class="text-red-400 group-hover/item:text-white">{{ $t('contextMenu.delete') }}</span>
        </button>
      </div>
    </div>

    <div v-if="expanded && node.children" class="mt-0.5">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        :search-query="searchQuery"
        :expand-trigger="expandTrigger"
        :collapse-trigger="collapseTrigger"
        :font-size="fontSize"
        @select="(path) => $emit('select', path)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ChevronRight, Folder, FolderOpen, FileText, FileCode, 
  FileJson, Image, File, Edit2, Copy, Trash2, Clipboard 
} from 'lucide-vue-next';
import { invoke } from '@tauri-apps/api/core';
import { nextTick, ref, watch, computed } from 'vue';
import { useAppStore } from '../../store/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { getFileIcon, getFileIconColor } from '../../utils/fileIcons';
import { isTextFile } from '../../utils/fileIcons';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const props = defineProps<{
  node: FileNode;
  depth: number;
  searchQuery?: string;
  expandTrigger?: number;
  collapseTrigger?: number;
  fontSize?: number;
}>();

const emit = defineEmits<{
  (e: 'select', path: string): void;
}>();

const { t } = useI18n();
const appStore = useAppStore();
const { clipboardPath } = storeToRefs(appStore);

const expanded = ref(false);
const showContextMenu = ref(false);
const menuPos = ref({ x: 0, y: 0 });
const isRenaming = ref(false);
const tempName = ref('');
const renameInput = ref<HTMLInputElement | null>(null);

// React to global expand/collapse triggers
watch(() => props.expandTrigger, () => {
    if (props.node.isDirectory) {
        expanded.value = true;
    }
});

watch(() => props.collapseTrigger, () => {
    if (props.node.isDirectory) {
        expanded.value = false;
    }
});

const handleContextMenu = (e: MouseEvent) => {
// ... existing logic ...
  showContextMenu.value = true;
  menuPos.value = { x: e.clientX, y: e.clientY };
};
// ... existing logic ...


const startRename = () => {
    showContextMenu.value = false;
    tempName.value = props.node.name;
    isRenaming.value = true;
    nextTick(() => {
        renameInput.value?.focus();
        renameInput.value?.select();
    });
};

const confirmRename = async () => {
    if (!isRenaming.value) return;
    if (!tempName.value.trim() || tempName.value === props.node.name) {
        isRenaming.value = false;
        return;
    }

    const oldPath = props.node.path;
    const parentDir = oldPath.substring(0, oldPath.lastIndexOf('/'));
    const newPath = `${parentDir}/${tempName.value.trim()}`;

    try {
        await invoke('rename_file', { src: oldPath, dest: newPath });
        isRenaming.value = false;
        // Tell parent to refresh
        window.dispatchEvent(new CustomEvent('refresh-file-tree'));
    } catch (err) {
        console.error('Rename failed:', err);
        alert(t('errors.renameFail', { error: err }));
        isRenaming.value = false;
    }
};

const handleCopyToClipboard = () => {
    showContextMenu.value = false;
    appStore.setClipboard(props.node.path);
};

const handlePaste = async () => {
    showContextMenu.value = false;
    if (!clipboardPath.value) return;

    const srcPath = clipboardPath.value;
    const fileName = srcPath.split('/').pop();
    
    // Determine destination directory
    // If current node is dir, paste inside. If file, paste in same dir.
    let destDir = props.node.isDirectory ? props.node.path : props.node.path.substring(0, props.node.path.lastIndexOf('/'));
    let destPath = `${destDir}/${fileName}`;

    // Simple duplicate check (this might overwrite if backend doesn't check, but we are copying so overwrite is bad)
    // Ideally we should check existence or append _copy
    // For now, let's append _copy if src == dest (pasting in same dir)
    if (srcPath === destPath) {
         const extIdx = destPath.lastIndexOf('.');
         destPath = extIdx !== -1 
             ? `${destPath.substring(0, extIdx)}_copy${destPath.substring(extIdx)}`
             : `${destPath}_copy`;
    }

    try {
        await invoke('copy_file', { src: srcPath, dest: destPath });
        window.dispatchEvent(new CustomEvent('refresh-file-tree'));
        appStore.clearClipboard();
    } catch (err) {
        console.error('Paste failed:', err);
        alert(t('errors.pasteFail', { error: err }));
    }
};

const handleDuplicate = async () => {
    showContextMenu.value = false;
    const oldPath = props.node.path;
    const extIdx = oldPath.lastIndexOf('.');
    const destPath = extIdx !== -1 
        ? `${oldPath.substring(0, extIdx)}_copy${oldPath.substring(extIdx)}`
        : `${oldPath}_copy`;

    try {
        await invoke('copy_file', { src: oldPath, dest: destPath });
        window.dispatchEvent(new CustomEvent('refresh-file-tree'));
    } catch (err) {
        console.error('Copy failed:', err);
        alert(t('errors.duplicateFail', { error: err }));
    }
};

const handleDelete = async () => {
    showContextMenu.value = false;
    if (!confirm(t('dialogs.confirmDelete', { name: props.node.name }))) return;

    try {
        await invoke('delete_file', { path: props.node.path });
        window.dispatchEvent(new CustomEvent('refresh-file-tree'));
    } catch (err) {
        console.error('Delete failed:', err);
        alert(t('errors.deleteFail', { error: err }));
    }
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

// Auto-expand when searching
watch(() => props.searchQuery, (newQuery: string | undefined) => {
  if (newQuery && props.node.isDirectory) {
    expanded.value = true;
  }
}, { immediate: true });

const getHighlightedName = () => {
  if (!props.searchQuery) return [{ text: props.node.name, isMatch: false }];
  
  const query = props.searchQuery.toLowerCase();
  const name = props.node.name;
  const index = name.toLowerCase().indexOf(query);
  
  if (index === -1) return [{ text: name, isMatch: false }];
  
  return [
    { text: name.slice(0, index), isMatch: false },
    { text: name.slice(index, index + query.length), isMatch: true },
    { text: name.slice(index + query.length), isMatch: false }
  ].filter(p => p.text);
};

const getNodeColor = () => {
    if (props.node.isDirectory) return 'text-[#cccccc]';
    return getFileIconColor(props.node.name);
};

const handleSingleClick = () => {
  if (props.node.isDirectory) {
    expanded.value = !expanded.value;
  } else {
    // Allow selecting all text files
    if (isTextFile(props.node.name)) {
        emit('select', props.node.path);
    }
  }
};

const handleDoubleClick = () => {
  if (!props.node.isDirectory) {
    // Allow selecting all text files
    if (isTextFile(props.node.name)) {
        emit('select', props.node.path);
    }
  }
};

const getIcon = () => {
  if (props.node.isDirectory) {
    return expanded.value ? FolderOpen : Folder;
  }
  
  const iconName = getFileIcon(props.node.name);
  const iconMap: Record<string, any> = {
    'FileText': FileText,
    'FileCode': FileCode,
    'FileJson': FileJson,
    'Image': Image,
    'File': File
  };
  
  return iconMap[iconName] || File;
};

const getIconColor = () => {
  if (props.node.isDirectory) {
    return 'text-yellow-500';
  }
  
  return getFileIconColor(props.node.name);
};
</script>
