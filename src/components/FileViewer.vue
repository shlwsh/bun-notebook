<template>
  <div class="h-full flex flex-col bg-[#1e1e1e] overflow-hidden" data-testid="file-viewer">
    <!-- File Header -->
    <div class="h-9 flex items-center justify-between px-4 border-b border-[#2b2b2b] bg-[#252525]" data-testid="file-viewer-header">
      <div class="flex items-center gap-2 text-blue-400">
        <component :is="getFileIcon()" :size="14" :class="getFileIconColor()" />
        <span class="text-xs font-medium" data-testid="file-name">{{ fileName }}</span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Save Button -->
        <button 
          v-if="isModified"
          data-testid="save-file-button"
          @click="saveFile"
          class="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] transition-all shadow-sm"
          :disabled="saving"
        >
          <Save v-if="!saving" :size="12" />
          <RefreshCw v-else :size="12" class="animate-spin" />
          <span>{{ saving ? $t('fileViewer.saving') : $t('fileViewer.save') }}</span>
        </button>

        <!-- Markdown Toggle: 三个按钮（预览 / 分屏 / 源码） -->
        <div v-if="isMarkdown" class="flex bg-[#2a2a2a] p-0.5 rounded mr-2" data-testid="view-mode-toggle">
          <button 
            data-testid="preview-mode-button"
            @click="viewMode = 'preview'"
            :class="[
              'px-2 py-0.5 text-[10px] rounded transition-all flex items-center gap-1',
              viewMode === 'preview' ? 'bg-[#3e3e3e] text-white shadow-sm' : 'text-[#858585] hover:text-[#cccccc]'
            ]"
            :title="$t('fileViewer.preview')"
          >
            <Eye :size="12" />
            <span>{{ $t('fileViewer.preview') }}</span>
          </button>
          <button 
            data-testid="split-mode-button"
            @click="viewMode = 'split'"
            :class="[
              'px-2 py-0.5 text-[10px] rounded transition-all flex items-center gap-1',
              viewMode === 'split' ? 'bg-[#3e3e3e] text-white shadow-sm' : 'text-[#858585] hover:text-[#cccccc]'
            ]"
            title="分屏"
          >
            <Columns2 :size="12" />
            <span>分屏</span>
          </button>
          <button 
            data-testid="editor-mode-button"
            @click="viewMode = 'editor'"
            :class="[
              'px-2 py-0.5 text-[10px] rounded transition-all flex items-center gap-1',
              viewMode === 'editor' ? 'bg-[#3e3e3e] text-white shadow-sm' : 'text-[#858585] hover:text-[#cccccc]'
            ]"
            :title="$t('fileViewer.raw')"
          >
            <Code2 :size="12" />
            <span>{{ $t('fileViewer.raw') }}</span>
          </button>
        </div>
        
        <div class="flex items-center gap-1.5 relative">
          <!-- Theme Button -->
          <button 
            data-testid="theme-button"
            @click="showThemeMenu = !showThemeMenu"
            class="flex items-center gap-1 px-2 py-0.5 bg-[#2a2a2a] hover:bg-[#3e3e3e] text-[#cccccc] rounded text-[10px] transition-all mr-2 relative"
            :title="$t('fileViewer.theme')"
          >
            <Palette :size="12" />
            <span>{{ $t('fileViewer.theme') }}</span>
            <ChevronDown :size="10" class="opacity-50" />
            
            <!-- Theme Dropdown -->
            <div 
              v-if="showThemeMenu"
              data-testid="theme-menu"
              class="absolute top-full right-0 mt-1 w-32 bg-[#252525] border border-[#3e3e3e] rounded shadow-xl z-[100] py-1"
              v-click-outside="() => showThemeMenu = false"
            >
              <button 
                v-for="theme in themes"
                :key="theme.value"
                :data-testid="`theme-option-${theme.value}`"
                @click.stop="handleThemeSelect(theme)"
                class="w-full text-left px-3 py-1.5 text-[11px] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
                :class="selectedTheme.value === theme.value ? 'text-blue-400 font-bold' : 'text-[#cccccc]'"
              >
                <span>{{ theme.name }}</span>
                <div class="w-3 h-3 rounded-full border border-gray-600" :style="{ backgroundColor: theme.style.bg }"></div>
              </button>
            </div>
          </button>

          <!-- Export Button -->
          <button 
            data-testid="export-button"
            @click="showExportMenu = !showExportMenu"
            class="flex items-center gap-1 px-2 py-0.5 bg-[#2a2a2a] hover:bg-[#3e3e3e] text-[#cccccc] rounded text-[10px] transition-all"
            :title="$t('fileViewer.export')"
          >
            <Download :size="12" />
            <span>{{ $t('fileViewer.export') }}</span>
            <ChevronDown :size="10" class="opacity-50" />
          </button>

          <!-- Export Dropdown -->
          <div 
            v-if="showExportMenu"
            data-testid="export-menu"
            class="absolute top-full right-0 mt-1 w-40 bg-[#252525] border border-[#3e3e3e] rounded shadow-2xl z-[100] py-1"
            v-click-outside="() => showExportMenu = false"
          >
            <button 
              data-testid="export-html-button"
              @click="handleExport('html')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportHtml') }}</span>
              <span class="opacity-40">.html</span>
            </button>
            <button 
              data-testid="export-pdf-button"
              @click="handleExport('pdf')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportPdf') }}</span>
              <span class="opacity-40">.pdf</span>
            </button>
            <button 
              data-testid="export-docx-button"
              @click="handleExport('docx')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportDocx') }}</span>
              <span class="opacity-40">.doc</span>
            </button>
          </div>
          
          <button 
            data-testid="print-button"
            @click="handlePrint"
            class="p-1 hover:bg-[#2a2a2a] rounded text-[#858585] hover:text-white transition-colors"
            :title="$t('fileViewer.print')"
          >
            <Printer :size="14" />
          </button>
        </div>
        
        <div class="flex items-center gap-3 ml-2 border-l border-[#3e3e3e] pl-3">
          <span class="text-[10px] text-[#858585] truncate max-w-[200px]">{{ filePath }}</span>
        </div>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <div class="h-8 flex items-center px-4 bg-[#1e1e1e] border-b border-[#2b2b2b] text-[11px] text-[#858585] overflow-x-auto whitespace-nowrap custom-scrollbar no-scrollbar">
      <div v-for="(part, index) in breadcrumbs" :key="index" class="flex items-center">
        <span v-if="index > 0" class="mx-1.5 opacity-40">/</span>
        <span :class="['hover:text-[#cccccc] cursor-default transition-colors', index === breadcrumbs.length - 1 ? 'text-[#cccccc]' : '']">
          {{ part }}
        </span>
      </div>
    </div>

    <!-- File Content -->
    <div class="flex-1 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-full text-[#858585]">
        <RefreshCw :size="24" class="animate-spin" />
      </div>
      
      <div v-else-if="error" class="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
        <AlertCircle :size="32" class="mb-2" />
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Case 1: Split Mode (编辑器 + 预览并排) -->
      <template v-else-if="isMarkdown && viewMode === 'split'">
        <div class="h-full flex flex-col bg-[#1e1e1e]">
          <!-- Markdown Toolbar -->
          <MarkdownToolbar :editor-view="editorView" />
          
          <div class="flex-1 flex flex-row overflow-hidden">
            <!-- 编辑器面板 -->
            <div class="overflow-hidden relative" :style="{ width: splitRatio + '%' }">
              <Codemirror
                v-model="editorContent"
                placeholder=""
                :style="{ height: '100%', fontSize: '13px' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="editorExtensions"
                @change="handleEditorChange"
                @ready="handleEditorReady"
              />
            </div>
            
            <!-- 可拖拽分隔条 -->
            <div 
              class="split-divider w-1 bg-[#2b2b2b] hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0"
              @mousedown="startSplitDrag"
            ></div>
            
            <!-- 预览面板 -->
            <div 
              ref="previewPanelRef"
              class="overflow-auto custom-scrollbar"
              :style="{ width: (100 - splitRatio) + '%' }"
              @scroll="handlePreviewScroll"
            >
              <div 
                class="markdown-body p-8 min-h-full transition-colors duration-300" 
                :style="{
                  backgroundColor: selectedTheme.style.bg,
                  color: selectedTheme.style.fg,
                  '--code-bg': selectedTheme.style.codeBg
                }"
                v-html="renderedMarkdown"
              ></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Case 2: Editor Only Mode -->
      <template v-else-if="shouldShowEditor">
        <div class="h-full flex flex-col bg-[#1e1e1e]">
          <!-- Markdown Toolbar (仅 MD 文件在编辑模式下显示) -->
          <MarkdownToolbar 
            v-if="isMarkdown && viewMode === 'editor'" 
            :editor-view="editorView"
          />
          
          <div class="flex-1 overflow-hidden relative">
            <Codemirror
              v-model="editorContent"
              placeholder=""
              :style="{ height: '100%', fontSize: '13px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="4"
              :extensions="editorExtensions"
              @change="handleEditorChange"
              @ready="handleEditorReady"
            />
          </div>
        </div>
      </template>

      <!-- Case 3: Markdown Preview Mode -->
      <template v-else-if="isMarkdown && viewMode === 'preview'">
        <div class="h-full overflow-auto custom-scrollbar">
          <div 
            class="markdown-body p-8 min-h-full transition-colors duration-300" 
            :style="{
              backgroundColor: selectedTheme.style.bg,
              color: selectedTheme.style.fg,
              '--code-bg': selectedTheme.style.codeBg
            }"
            v-html="renderedMarkdown"
          ></div>
        </div>
      </template>

      <!-- Case 4: Image View -->
      <div v-else-if="isImageFile" class="flex items-center justify-center h-full p-4">
        <img :src="`asset://localhost/${filePath}`" :alt="fileName" class="max-w-full max-h-full object-contain" />
      </div>

      <!-- Case 5: Empty File (already covered by editor, but for safety) -->
      <div v-else-if="content.length === 0 && (isTextFile || isMarkdown)" class="flex flex-col items-center justify-center h-full text-[#6a6a6a] p-4 text-center">
        <FileText :size="32" class="mb-2 opacity-50" />
        <p class="text-sm">{{ $t('fileViewer.empty') }}</p>
      </div>

      <!-- Case 6: Unsupported -->
      <div v-else class="flex flex-col items-center justify-center h-full text-[#858585] p-4 text-center">
        <File :size="32" class="mb-2" />
        <p class="text-sm">{{ $t('fileViewer.unsupported') }}</p>
        <p class="text-xs mt-1">{{ fileExtension.toUpperCase() || '未知' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  FileCode, FileText, FileJson, Image as ImageIcon,
  File, RefreshCw, AlertCircle, Save,
  Download, Printer, ChevronDown, Palette,
  Eye, Columns2, Code2
} from 'lucide-vue-next';
import html2pdf from 'html2pdf.js';
import mermaid from 'mermaid';
import { detectFileType, getFileTypeConfig, isEditableFile, isPreviewableFile } from '../utils/fileTypeDetector';
import { getFileIcon as getIconName, getFileIconColor as getIconColorName } from '../utils/fileIcons';
import { FileType } from '../types/fileTypes';
import MarkdownToolbar from './editor/MarkdownToolbar.vue';
import { useAppStore } from '../store/app';
import { useNavStore } from '../store/navigation';
import type { HeadingItem } from '../store/navigation';

import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown-dark.css';

// Editor imports
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { linter, lintGutter } from '@codemirror/lint';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { search, searchKeymap } from '@codemirror/search';

// Markdown 操作工具
import {
  wrapSelection,
  insertLink,
  insertCodeBlock
} from '../utils/markdownOperations';

const { t } = useI18n();
const appStore = useAppStore();
const navStore = useNavStore();

const props = defineProps<{
  filePath: string;
}>();

const content = ref('');
const editorContent = ref('');
const loading = ref(false);
const saving = ref(false);
const error = ref('');
// 视图模式：preview（预览）、editor（源码）、split（分屏）
const viewMode = ref<'preview' | 'editor' | 'split'>('preview');
const showExportMenu = ref(false);
const showThemeMenu = ref(false);
const editorView = ref<EditorView>();

// 分屏比例控制
const splitRatio = ref(50);
const previewPanelRef = ref<HTMLElement>();

// 滚动同步标志，防止循环触发
const isScrollSyncing = ref(false);

// 自动保存定时器
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

// 分屏模式下 updateMarkdown 的 debounce 定时器
let splitUpdateTimer: ReturnType<typeof setTimeout> | null = null;

const themes = computed(() => [
  { name: t('fileViewer.themeNames.default'), value: 'default', style: { bg: '#1e1e1e', fg: '#cccccc', codeBg: '#2d2d2d' } },
  { name: t('fileViewer.themeNames.light'), value: 'light', style: { bg: '#ffffff', fg: '#333333', codeBg: '#f6f8fa' } },
  { name: t('fileViewer.themeNames.sepia'), value: 'sepia', style: { bg: '#f4ecd8', fg: '#5b4636', codeBg: '#fdf6e3' } },
  { name: t('fileViewer.themeNames.github'), value: 'github', style: { bg: '#ffffff', fg: '#24292f', codeBg: '#f6f8fa' } },
]);

const selectedTheme = ref(themes.value[0]);

// 监听语言变化以更新主题名称
watch(themes, (newThemes) => {
    const currentThemeValue = selectedTheme.value.value;
    const newTheme = newThemes.find(th => th.value === currentThemeValue);
    if (newTheme) {
        selectedTheme.value = newTheme;
    }
});

const handleThemeSelect = (theme: any) => {
  selectedTheme.value = theme;
  showThemeMenu.value = false;
};

const handlePrint = () => {
  window.print();
};

// ==================== 导出功能 ====================

const handleExport = async (format: 'html' | 'pdf' | 'docx') => {
    showExportMenu.value = false;

    const element = document.querySelector('.markdown-body');
    if (!element) {
      alert(t('errors.contentNotFound'));
      return;
    }

    // 克隆元素以安全修改
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = 'white';
    clone.style.color = 'black';
    clone.style.padding = '20px';
    clone.style.width = '100%';

    // 修复表格样式
    const tables = clone.querySelectorAll('table');
    tables.forEach((table) => {
      (table as HTMLElement).style.borderCollapse = 'collapse';
      (table as HTMLElement).style.width = '100%';
      (table as HTMLElement).style.border = '1px solid black';
      (table as HTMLElement).style.marginBottom = '1em';
      
      const cells = table.querySelectorAll('th, td');
      cells.forEach((cell) => {
        (cell as HTMLElement).style.border = '1px solid black';
        (cell as HTMLElement).style.padding = '8px';
        (cell as HTMLElement).style.textAlign = 'left';
      });
    });

    // 修复代码块样式
    const codeBlocks = clone.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      (block as HTMLElement).style.backgroundColor = '#f5f5f5';
      (block as HTMLElement).style.color = '#333';
      (block as HTMLElement).style.border = '1px solid #ddd';
      (block as HTMLElement).style.padding = '10px';
      (block as HTMLElement).style.whiteSpace = 'pre-wrap';
    });

    // 处理 Mermaid 图表导出
    if (format !== 'pdf') {
       const originalMermaids = element.querySelectorAll('.mermaid');
       const cloneMermaids = clone.querySelectorAll('.mermaid');
       
       mermaid.initialize({ 
         startOnLoad: false, 
         theme: 'default',
         htmlLabels: false,
         flowchart: { htmlLabels: false }
       });

       for (let i = 0; i < originalMermaids.length; i++) {
         const originalContainer = originalMermaids[i] as HTMLElement;
         const cloneDiv = cloneMermaids[i] as HTMLElement;
         
         const sourceCode = originalContainer.dataset.source ? decodeURIComponent(originalContainer.dataset.source) : null;
         
         if (sourceCode && cloneDiv) {
            try {
              const id = `mermaid-export-${Date.now()}-${i}`;
              const { svg } = await mermaid.render(id, sourceCode);
              
              const tempContainer = document.createElement('div');
              tempContainer.innerHTML = svg;
              const cleanSvg = tempContainer.querySelector('svg');
              
              if (cleanSvg) {
                 const pngDataUrl = await svgToPng(cleanSvg);
                 const img = document.createElement('img');
                 img.src = pngDataUrl;
                 img.style.maxWidth = '100%';
                 img.style.height = 'auto';
                 
                 cloneDiv.innerHTML = '';
                 cloneDiv.appendChild(img);
              }
            } catch (e) {
              console.error('Failed to export mermaid chart', e);
              cloneDiv.style.border = '1px dashed red';
              cloneDiv.innerText = t('errors.exportFail', { error: 'Chart export failed' });
            }
         }
       }
       
       mermaid.initialize({ startOnLoad: false, htmlLabels: true, flowchart: { htmlLabels: true } });
    }

    // PDF 导出
    if (format === 'pdf') {
       const opt = {
        margin: 10,
        filename: props.filePath.split('/').pop()?.replace(/\.md$/, '.pdf') || 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 } as any,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } as any,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      try {
        const pdfBlob = await html2pdf().set(opt).from(clone).output('blob');
        const { save } = await import('@tauri-apps/plugin-dialog');
        const defaultPath = props.filePath.replace(/\.md$/, '.pdf');
        const selectedPath = await save({
            defaultPath,
            filters: [{ name: 'PDF', extensions: ['pdf'] }]
        });
        if (!selectedPath) return;
        const arrayBuffer = await pdfBlob.arrayBuffer();
        await invoke('save_binary_file', { path: selectedPath, data: Array.from(new Uint8Array(arrayBuffer)) });
        alert(t('errors.exportSuccess', { path: selectedPath }));
      } catch (err) {
        console.error('PDF导出失败:', err);
        alert(t('errors.exportFail', { error: err }));
      }
      return;
    }

    // HTML/DOCX 导出
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const defaultPath = props.filePath.replace(/\.md$/, `.${format}`);
      const selectedPath = await save({
        defaultPath,
        filters: [{
          name: format.toUpperCase(),
          extensions: [format]
        }]
      });

      if (!selectedPath) return;

      await invoke('export_markdown', {
        path: selectedPath,
        content: clone.innerHTML, 
        format,
        isContentHtml: true
      });
      alert(t('errors.exportSuccess', { path: selectedPath }));
    } catch (err) {
      console.error('导出失败:', err);
      alert(t('errors.exportFail', { error: err }));
    }
  };

// SVG 转 PNG 辅助函数
const svgToPng = (svg: SVGSVGElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const rect = svg.getBoundingClientRect();
        canvas.width = (rect.width || svg.viewBox.baseVal.width) * 2;
        canvas.height = (rect.height || svg.viewBox.baseVal.height) * 2;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           URL.revokeObjectURL(url);
           reject(new Error('Canvas context failed')); 
           return;
        }
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngData = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(pngData);
      };
      
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
};

// ==================== 计算属性 ====================

const isModified = computed(() => {
  return content.value !== editorContent.value;
});

const shouldShowEditor = computed(() => {
  // Markdown 文件：编辑模式或分屏模式显示编辑器
  if (isMarkdown.value) return viewMode.value === 'editor' || viewMode.value === 'split';
  // 其他文本文件始终显示编辑器
  return isTextFile.value;
});

const shouldShowPreview = computed(() => {
  if (!isMarkdown.value) return false;
  return viewMode.value === 'preview' || viewMode.value === 'split';
});

const fileName = computed(() => props.filePath.split('/').pop() || 'Untitled');
const fileExtension = computed(() => props.filePath.split('.').pop()?.toLowerCase() || '');

// 文件类型检测
const fileType = computed(() => detectFileType(props.filePath));
const fileTypeConfig = computed(() => getFileTypeConfig(props.filePath));

const isImageFile = computed(() => fileType.value === FileType.IMAGE);
const isTextFile = computed(() => isEditableFile(props.filePath) || isPreviewableFile(props.filePath));

const getFileIcon = () => {
  const iconName = getIconName(props.filePath);
  const iconMap: Record<string, any> = {
    'FileText': FileText,
    'FileCode': FileCode,
    'FileJson': FileJson,
    'Image': ImageIcon,
    'File': File
  };
  return iconMap[iconName] || File;
};

const getFileIconColor = () => {
  return getIconColorName(props.filePath);
};

// ==================== Mermaid 初始化 ====================

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

const isMarkdown = computed(() => fileExtension.value === 'md');
const breadcrumbs = computed(() => props.filePath.split('/').filter(p => p));

// ==================== 图片处理 ====================

const handleImageFiles = async (files: File[], view: EditorView) => {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    
    try {
      const reader = new FileReader();
      const fileData = await new Promise<ArrayBuffer>((resolve) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.readAsArrayBuffer(file);
      });

      const currentDir = props.filePath.substring(0, props.filePath.lastIndexOf('/'));
      const attachmentsDir = `${currentDir}/attachments`;
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const fullPath = `${attachmentsDir}/${fileName}`;

      await invoke('create_dir', { path: attachmentsDir });
      await invoke('save_binary_file', { path: fullPath, data: Array.from(new Uint8Array(fileData)) });

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: `\n![${file.name}](attachments/${fileName})\n` },
        selection: { anchor: cursor + file.name.length + 18 }
      });
    } catch (err) {
      console.error('Failed to process image:', err);
    }
  }
};

// ==================== 编辑器扩展 ====================

const editorExtensions = computed(() => {
  const extensions = [
    oneDark, 
    lintGutter(),
    EditorView.lineWrapping,
    // 查找替换功能（所有文件类型通用）
    search(),
    keymap.of(searchKeymap),
    EditorView.domEventHandlers({
      drop: (event, view) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          handleImageFiles(Array.from(files), view);
          return true;
        }
      },
      paste: (event, view) => {
        const items = event.clipboardData?.items;
        if (items) {
          const files = [];
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              files.push(item.getAsFile());
            }
          }
          if (files.length > 0) {
            handleImageFiles(files as File[], view);
            return true;
          }
        }
      }
    })
  ];
  
  const language = fileTypeConfig.value.language;
  
  if (language === 'markdown') {
    extensions.push(markdown());
    // 表格自动补全 + 常用快捷键
    extensions.push(keymap.of([
      // Mod-b: 加粗
      {
        key: 'Mod-b',
        run: (view) => {
          wrapSelection(view, '**');
          return true;
        }
      },
      // Mod-i: 斜体
      {
        key: 'Mod-i',
        run: (view) => {
          wrapSelection(view, '*');
          return true;
        }
      },
      // Mod-k: 插入链接
      {
        key: 'Mod-k',
        run: (view) => {
          insertLink(view);
          return true;
        }
      },
      // Mod-Shift-k: 插入代码块
      {
        key: 'Mod-Shift-k',
        run: (view) => {
          insertCodeBlock(view);
          return true;
        }
      },
      // Mod-Shift-x: 删除线
      {
        key: 'Mod-Shift-x',
        run: (view) => {
          wrapSelection(view, '~~');
          return true;
        }
      },
      // Enter: 表格自动补全
      {
        key: 'Enter',
        run: (view) => {
          const line = view.state.doc.lineAt(view.state.selection.main.head);
          const text = line.text.trim();
          
          if (text.startsWith('|') && text.endsWith('|')) {
            const columns = text.split('|').length - 1;
            const newRow = '\n|' + '   |'.repeat(columns);
            view.dispatch({
              changes: { from: line.to, insert: newRow },
              selection: { anchor: line.to + 3 }
            });
            return true;
          }
          return false;
        }
      },
      ...defaultKeymap
    ]));
    
    // Markdown 基础 lint
    extensions.push(linter((view: EditorView) => {
      const diagnostics: any[] = [];
      const text = view.state.doc.toString();
      
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        if (/^#+[^#\s]/.test(line)) {
          diagnostics.push({
            from: view.state.doc.line(i + 1).from,
            to: view.state.doc.line(i + 1).to,
            severity: 'warning',
            message: '标题符号 # 后建议增加空格',
            actions: [{
              name: '修复',
              apply(view: EditorView, from: number) {
                const sharpCount = line.match(/^#+/)?.[0].length || 0;
                view.dispatch({
                  changes: { from, insert: line.slice(0, sharpCount) + ' ' + line.slice(sharpCount) }
                });
              }
            }]
          });
        }
      });
      return diagnostics;
    }));
  } else if (language === 'typescript' || language === 'javascript') {
    extensions.push(javascript({ typescript: language === 'typescript' }));
  } else if (language === 'json') {
    extensions.push(javascript());
  } else if (fileExtension.value === 'py') {
    extensions.push(python());
  } else if (fileExtension.value === 'rs') {
    extensions.push(rust());
  }
  
  return extensions;
});

// ==================== 字数统计与标题解析 ====================

const computeFileStats = (text: string) => {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  navStore.updateFileStats({ characters, words, lines });
};

const parseHeadings = (text: string) => {
  const headings: HeadingItem[] = [];
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: index + 1,
      });
    }
  });
  navStore.updateHeadings(headings);
};

// ==================== 编辑器事件处理 ====================

const handleEditorChange = (value: string) => {
  editorContent.value = value;
  
  // 字数统计
  computeFileStats(value);
  // 解析标题
  parseHeadings(value);
  
  // 自动保存：启动 debounce 定时器
  if (appStore.autoSave && isModified.value) {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    autoSaveTimer = setTimeout(() => {
      if (isModified.value) {
        saveFile();
      }
    }, appStore.autoSaveDelay || 3000);
  }
};

const handleEditorReady = (payload: any) => {
  editorView.value = payload.view;
  
  // 分屏模式下绑定编辑器滚动同步
  if (viewMode.value === 'split' && payload.view) {
    setupEditorScrollSync(payload.view);
  }
};

// ==================== 滚动同步 ====================

const setupEditorScrollSync = (view: EditorView) => {
  const scrollDom = view.scrollDOM;
  if (!scrollDom) return;
  
  scrollDom.addEventListener('scroll', () => {
    if (isScrollSyncing.value) return;
    if (viewMode.value !== 'split') return;
    
    const previewEl = previewPanelRef.value;
    if (!previewEl) return;
    
    isScrollSyncing.value = true;
    
    const editorScrollTop = scrollDom.scrollTop;
    const editorScrollHeight = scrollDom.scrollHeight - scrollDom.clientHeight;
    const scrollRatio = editorScrollHeight > 0 ? editorScrollTop / editorScrollHeight : 0;
    
    const previewScrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
    previewEl.scrollTop = scrollRatio * previewScrollHeight;
    
    requestAnimationFrame(() => {
      isScrollSyncing.value = false;
    });
  });
};

const handlePreviewScroll = () => {
  if (isScrollSyncing.value) return;
  if (viewMode.value !== 'split') return;
  
  const previewEl = previewPanelRef.value;
  if (!previewEl || !editorView.value) return;
  
  isScrollSyncing.value = true;
  
  const previewScrollTop = previewEl.scrollTop;
  const previewScrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
  const scrollRatio = previewScrollHeight > 0 ? previewScrollTop / previewScrollHeight : 0;
  
  const scrollDom = editorView.value.scrollDOM;
  const editorScrollHeight = scrollDom.scrollHeight - scrollDom.clientHeight;
  scrollDom.scrollTop = scrollRatio * editorScrollHeight;
  
  requestAnimationFrame(() => {
    isScrollSyncing.value = false;
  });
};

// ==================== 分屏拖拽 ====================

const startSplitDrag = (e: MouseEvent) => {
  e.preventDefault();
  const startX = e.clientX;
  const startRatio = splitRatio.value;
  const container = (e.target as HTMLElement).parentElement;
  if (!container) return;
  
  const containerWidth = container.getBoundingClientRect().width;
  
  const onMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaRatio = (deltaX / containerWidth) * 100;
    const newRatio = Math.min(80, Math.max(20, startRatio + deltaRatio));
    splitRatio.value = newRatio;
  };
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// ==================== 保存功能 ====================

const saveFile = async () => {
  if (!props.filePath) return;
  
  saving.value = true;
  try {
    await invoke('write_file_content', { 
      path: props.filePath, 
      content: editorContent.value 
    });
    content.value = editorContent.value;
    console.log('File saved successfully');
  } catch (err: any) {
    console.error('Save failed:', err);
    error.value = t('errors.saveFail', { error: err });
  } finally {
    saving.value = false;
  }
};

// window blur 时立即保存
const handleWindowBlur = () => {
  if (appStore.autoSave && isModified.value) {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
    saveFile();
  }
};

// ==================== Markdown 渲染 ====================

// 配置 Marked 渲染器，处理 Mermaid 代码块和代码高亮
const renderer = new marked.Renderer();
const originalCode = renderer.code.bind(renderer);
renderer.code = (args: any) => {
  const { text, lang } = args;
  if (lang === 'mermaid') {
    const encoded = encodeURIComponent(text);
    return `<div class="mermaid-container my-4 bg-[#252525] p-4 rounded-lg overflow-x-auto"><pre class="mermaid" data-source="${encoded}">${text}</pre></div>`;
  }
  
  // 代码块复制按钮
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<div class="code-block-wrapper relative group my-2">
        <button class="copy-code-btn absolute top-2 right-2 px-2 py-1 text-[10px] bg-[#3e3e3e] hover:bg-[#505050] text-[#cccccc] rounded opacity-0 group-hover:opacity-100 transition-opacity" data-code="${encodeURIComponent(text)}">复制</button>
        <pre class="hljs leading-relaxed p-4 rounded bg-[#1a1a1a] overflow-x-auto"><code class="language-${lang}">${highlighted}</code></pre>
      </div>`;
    } catch (e) {}
  }
  
  // 无语言标记的代码块也添加复制按钮
  const fallbackHtml = originalCode(args);
  return `<div class="code-block-wrapper relative group my-2">
    <button class="copy-code-btn absolute top-2 right-2 px-2 py-1 text-[10px] bg-[#3e3e3e] hover:bg-[#505050] text-[#cccccc] rounded opacity-0 group-hover:opacity-100 transition-opacity" data-code="${encodeURIComponent(text)}">复制</button>
    ${fallbackHtml}
  </div>`;
};
marked.setOptions({ renderer });

const renderedMarkdown = ref('');

const updateMarkdown = async () => {
  if (!isMarkdown.value) {
    renderedMarkdown.value = '';
    return;
  }
  
  // 分屏/编辑模式使用 editorContent，预览模式使用 content
  const source = (viewMode.value === 'split' || viewMode.value === 'editor') 
    ? editorContent.value 
    : content.value;
  if (!source) {
    renderedMarkdown.value = '';
    return;
  }

  renderedMarkdown.value = await marked.parse(source);
  
  // DOM 更新后渲染 Mermaid 图表并绑定复制按钮事件
  nextTick(async () => {
    try {
      await mermaid.run({
        querySelector: '.mermaid',
      });
    } catch (e) {
      console.error('Mermaid rendering failed:', e);
    }
    
    // 绑定代码块复制按钮事件
    bindCopyButtons();
  });
};

// 绑定代码块复制按钮
const bindCopyButtons = () => {
  const buttons = document.querySelectorAll('.copy-code-btn');
  buttons.forEach((btn) => {
    // 避免重复绑定
    if ((btn as any)._copyBound) return;
    (btn as any)._copyBound = true;
    
    btn.addEventListener('click', async (e) => {
      const button = e.currentTarget as HTMLElement;
      const code = decodeURIComponent(button.dataset.code || '');
      try {
        await navigator.clipboard.writeText(code);
        const originalText = button.textContent;
        button.textContent = '已复制!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    });
  });
};

// 分屏模式下 debounce 更新预览
const debouncedUpdateMarkdown = () => {
  if (splitUpdateTimer) {
    clearTimeout(splitUpdateTimer);
  }
  splitUpdateTimer = setTimeout(() => {
    updateMarkdown();
  }, 300);
};

// 监听相关状态变化以更新 Markdown 渲染
watch([isMarkdown, content, viewMode], () => {
  updateMarkdown();
});

watch(editorContent, () => {
  if (viewMode.value === 'split') {
    debouncedUpdateMarkdown();
  } else {
    updateMarkdown();
  }
});

// 监听 viewMode 变化，分屏模式下重新设置滚动同步
watch(viewMode, (newMode) => {
  if (newMode === 'split') {
    nextTick(() => {
      if (editorView.value) {
        setupEditorScrollSync(editorView.value);
      }
    });
  }
});

// ==================== 文件加载 ====================

const loadFileContent = async () => {
  if (!props.filePath) {
    console.warn('FileViewer: No file path provided');
    return;
  }
  
  console.log('FileViewer: Loading file via backend:', props.filePath);
  
  loading.value = true;
  error.value = '';
  
  try {
    if (isTextFile.value || isMarkdown.value) {
      console.log('FileViewer: Invoking read_file_content...');
      const fileContent: string = await invoke('read_file_content', { path: props.filePath });
      content.value = fileContent;
      editorContent.value = fileContent;
      console.log('FileViewer: File loaded successfully, length:', content.value.length);
      
      // 加载后计算字数统计和标题
      computeFileStats(fileContent);
      parseHeadings(fileContent);
    } else if (isImageFile.value) {
      console.log('FileViewer: Skipping content load for image');
    }
  } catch (err: any) {
    error.value = t('errors.loadFail', { error: err });
    console.error('FileViewer: Backend read failed:', err);
  } finally {
    loading.value = false;
  }
};

// ==================== 快捷键 ====================

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (isModified.value) saveFile();
  }
};

// ==================== 生命周期 ====================

onMounted(() => {
  console.log('FileViewer: Component mounted with filePath:', props.filePath);
  loadFileContent();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('blur', handleWindowBlur);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('blur', handleWindowBlur);
  
  // 清理定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
  if (splitUpdateTimer) {
    clearTimeout(splitUpdateTimer);
    splitUpdateTimer = null;
  }
});

// 监听文件路径变化
watch(() => props.filePath, (newPath, oldPath) => {
  console.log('FileViewer: filePath changed from', oldPath, 'to', newPath);
  viewMode.value = 'preview'; // 切换文件时重置为预览模式
  loadFileContent();
});

// ==================== 自定义指令 ====================

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
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}

.mermaid-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.mermaid {
  background: transparent !important;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

/* Code Highlighting Styles */
.hljs {
  background: var(--code-bg, #2d2d2d) !important;
  padding: 0 !important;
  font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace;
}

:deep(pre) {
    background-color: var(--code-bg, #2d2d2d) !important;
}

/* 代码块复制按钮样式 */
:deep(.code-block-wrapper) {
  position: relative;
}

:deep(.copy-code-btn) {
  z-index: 10;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

/* 分屏分隔条样式 */
.split-divider {
  position: relative;
}

.split-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 30px;
  background: #555;
  border-radius: 1px;
  opacity: 0;
  transition: opacity 0.2s;
}

.split-divider:hover::after {
  opacity: 1;
}

/* Codemirror UI Polish */
:deep(.cm-editor) {
  height: 100%;
  outline: none !important;
}
:deep(.cm-scroller) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace !important;
}
:deep(.cm-gutters) {
  background-color: #1e1e1e !important;
  border-right: 1px solid #2b2b2b !important;
  color: #6a6a6a !important;
}
:deep(.cm-activeLineGutter) {
  background-color: #2a2a2a !important;
  color: #cccccc !important;
}
:deep(.cm-activeLine) {
  background-color: #2a2a2a40 !important;
}

/* 查找替换面板样式 */
:deep(.cm-search) {
  background-color: #252525 !important;
  border-bottom: 1px solid #3e3e3e !important;
}

:deep(.cm-search input) {
  background-color: #1e1e1e !important;
  color: #cccccc !important;
  border: 1px solid #3e3e3e !important;
  border-radius: 3px;
}

:deep(.cm-search button) {
  background-color: #3e3e3e !important;
  color: #cccccc !important;
  border: none !important;
  border-radius: 3px;
  cursor: pointer;
}

:deep(.cm-search button:hover) {
  background-color: #505050 !important;
}

:deep(.cm-search label) {
  color: #858585 !important;
}

/* Linting Styles */
:deep(.cm-diagnostic-warning) {
  border-left: 3px solid #eab308 !important;
}
:deep(.cm-lintRange-warning) {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAB1JREFUGFdjZEADJhgGZ0A6GIsByoGoM8ID6O6E8AB0AgYf0Y9pRwAAAABJRU5ErkJggg==') !important;
  background-repeat: repeat-x !important;
  background-position: left bottom !important;
}

pre {
  tab-size: 4;
}

/* Breadcrumbs hide scrollbar but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media print {
  .primary-sidebar, 
  .activity-bar,
  .menu-bar,
  .status-bar,
  .file-header,
  .breadcrumbs {
    display: none !important;
  }
  .markdown-body {
    padding: 0 !important;
    background: white !important;
    color: black !important;
  }
  .flex-1 {
    overflow: visible !important;
  }
}
</style>
