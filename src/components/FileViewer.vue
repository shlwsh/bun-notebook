<template>
  <div class="h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
    <!-- File Header -->
    <div class="h-9 flex items-center justify-between px-4 border-b border-[#2b2b2b] bg-[#252525]">
      <div class="flex items-center gap-2 text-blue-400">
        <component :is="getFileIcon()" :size="14" :class="getFileIconColor()" />
        <span class="text-xs font-medium">{{ fileName }}</span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Save Button -->
        <button 
          v-if="isModified"
          @click="saveFile"
          class="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] transition-all shadow-sm"
          :disabled="saving"
        >
          <Save v-if="!saving" :size="12" />
          <RefreshCw v-else :size="12" class="animate-spin" />
          <span>{{ saving ? $t('fileViewer.saving') : $t('fileViewer.save') }}</span>
        </button>

        <!-- Markdown Toggle -->
        <div v-if="isMarkdown" class="flex bg-[#2a2a2a] p-0.5 rounded mr-2">
          <button 
            @click="showRaw = false"
            :class="[
              'px-2 py-0.5 text-[10px] rounded transition-all',
              !showRaw ? 'bg-[#3e3e3e] text-white shadow-sm' : 'text-[#858585] hover:text-[#cccccc]'
            ]"
          >
            {{ $t('fileViewer.preview') }}
          </button>
          <button 
            @click="showRaw = true"
            :class="[
              'px-2 py-0.5 text-[10px] rounded transition-all',
              showRaw ? 'bg-[#3e3e3e] text-white shadow-sm' : 'text-[#858585] hover:text-[#cccccc]'
            ]"
          >
            {{ $t('fileViewer.raw') }}
          </button>
        </div>
        
        <div class="flex items-center gap-1.5 relative">
          <!-- Theme Button -->
          <button 
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
              class="absolute top-full right-0 mt-1 w-32 bg-[#252525] border border-[#3e3e3e] rounded shadow-xl z-[100] py-1"
              v-click-outside="() => showThemeMenu = false"
            >
              <button 
                v-for="theme in themes"
                :key="theme.value"
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
            class="absolute top-full right-0 mt-1 w-40 bg-[#252525] border border-[#3e3e3e] rounded shadow-2xl z-[100] py-1"
            v-click-outside="() => showExportMenu = false"
          >
            <button 
              @click="handleExport('html')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportHtml') }}</span>
              <span class="opacity-40">.html</span>
            </button>
            <button 
              @click="handleExport('pdf')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportPdf') }}</span>
              <span class="opacity-40">.pdf</span>
            </button>
            <button 
              @click="handleExport('docx')"
              class="w-full text-left px-3 py-1.5 text-[11px] text-[#cccccc] hover:bg-blue-600 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{{ $t('fileViewer.exportDocx') }}</span>
              <span class="opacity-40">.doc</span>
            </button>
          </div>
          
          <button 
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
    <div class="flex-1 overflow-auto custom-scrollbar">
      <div v-if="loading" class="flex items-center justify-center h-full text-[#858585]">
        <RefreshCw :size="24" class="animate-spin" />
      </div>
      
      <div v-else-if="error" class="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
        <AlertCircle :size="32" class="mb-2" />
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Case 1: Editor Mode (Text/Code or Markdown Raw) -->
      <template v-if="shouldShowEditor">
        <div class="h-full flex flex-col bg-[#1e1e1e]">
          <!-- Markdown Toolbar (only for MD files in edit mode) -->
          <MarkdownToolbar 
            v-if="isMarkdown && showRaw" 
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

      <!-- Case 2: Markdown Preview Mode -->
      <template v-else-if="isMarkdown && !showRaw">
        <div 
          class="markdown-body p-8 min-h-full transition-colors duration-300" 
          :style="{
            backgroundColor: selectedTheme.style.bg,
            color: selectedTheme.style.fg,
            '--code-bg': selectedTheme.style.codeBg
          }"
          v-html="renderedMarkdown"
        ></div>
      </template>

      <!-- Case 3: Image View -->
      <div v-else-if="isImageFile" class="flex items-center justify-center h-full p-4">
        <img :src="`asset://localhost/${filePath}`" :alt="fileName" class="max-w-full max-h-full object-contain" />
      </div>

      <!-- Case 4: Empty File (already covered by editor, but for safety) -->
      <div v-else-if="content.length === 0 && (isTextFile || isMarkdown)" class="flex flex-col items-center justify-center h-full text-[#6a6a6a] p-4 text-center">
        <FileText :size="32" class="mb-2 opacity-50" />
        <p class="text-sm">{{ $t('fileViewer.empty') }}</p>
      </div>

      <!-- Case 5: Unsupported -->
      <div v-else class="flex flex-col items-center justify-center h-full text-[#858585] p-4 text-center">
        <File :size="32" class="mb-2" />
        <p class="text-sm">{{ $t('fileViewer.unsupported') }}</p>
        <p class="text-xs mt-1">{{ fileExtension.toUpperCase() || '未知' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  FileCode, FileText, FileJson, Image as ImageIcon,
  File, RefreshCw, AlertCircle, Save,
  Download, Printer, ChevronDown, Palette
} from 'lucide-vue-next';
import html2pdf from 'html2pdf.js';
import mermaid from 'mermaid';
import { detectFileType, getFileTypeConfig, isEditableFile, isPreviewableFile } from '../utils/fileTypeDetector';
import { getFileIcon as getIconName, getFileIconColor as getIconColorName } from '../utils/fileIcons';
import { FileType } from '../types/fileTypes';
import MarkdownToolbar from './editor/MarkdownToolbar.vue';

const { t } = useI18n();

const props = defineProps<{
  filePath: string;
}>();

const content = ref('');
const editorContent = ref('');
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const showRaw = ref(false);
const showExportMenu = ref(false);
const showThemeMenu = ref(false);
const editorView = ref<EditorView>();

const themes = computed(() => [
  { name: t('fileViewer.themeNames.default'), value: 'default', style: { bg: '#1e1e1e', fg: '#cccccc', codeBg: '#2d2d2d' } },
  { name: t('fileViewer.themeNames.light'), value: 'light', style: { bg: '#ffffff', fg: '#333333', codeBg: '#f6f8fa' } },
  { name: t('fileViewer.themeNames.sepia'), value: 'sepia', style: { bg: '#f4ecd8', fg: '#5b4636', codeBg: '#fdf6e3' } },
  { name: t('fileViewer.themeNames.github'), value: 'github', style: { bg: '#ffffff', fg: '#24292f', codeBg: '#f6f8fa' } },
]);

const selectedTheme = ref(themes.value[0]);

// Watch for language changes to update selected theme name if needed
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
// windowRef removed as it was unused

const handlePrint = () => {
  window.print();
};

const handleExport = async (format: 'html' | 'pdf' | 'docx') => {
    showExportMenu.value = false;

    // Common processing for all formats
    const element = document.querySelector('.markdown-body');
    if (!element) {
      alert(t('errors.contentNotFound'));
      return;
    }

    // Clone element to modify safely
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = 'white';
    clone.style.color = 'black';
    clone.style.padding = '20px';
    clone.style.width = '100%';

    // Fix Table Styles for Word/HTML (inline styles are safer for export)
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

    // Fix Code Blocks
    const codeBlocks = clone.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      (block as HTMLElement).style.backgroundColor = '#f5f5f5';
      (block as HTMLElement).style.color = '#333';
      (block as HTMLElement).style.border = '1px solid #ddd';
      (block as HTMLElement).style.padding = '10px';
      (block as HTMLElement).style.whiteSpace = 'pre-wrap';
    });

    // Process charts for backend export
    if (format !== 'pdf') {
       const originalMermaids = element.querySelectorAll('.mermaid');
       const cloneMermaids = clone.querySelectorAll('.mermaid');
       
       // Temporarily initialize mermaid for headless rendering without htmlLabels (secure for canvas)
       // We need a unique ID for each render
       mermaid.initialize({ 
         startOnLoad: false, 
         theme: 'default',
         htmlLabels: false, // CRITICAL: Disable HTML labels to avoid foreignObject
         flowchart: { htmlLabels: false }
       });

       for (let i = 0; i < originalMermaids.length; i++) {
         const originalContainer = originalMermaids[i] as HTMLElement;
         const cloneDiv = cloneMermaids[i] as HTMLElement;
         
         const sourceCode = originalContainer.dataset.source ? decodeURIComponent(originalContainer.dataset.source) : null;
         
         if (sourceCode && cloneDiv) {
            try {
              const id = `mermaid-export-${Date.now()}-${i}`;
              // Render "clean" SVG (no foreignObject)
              const { svg } = await mermaid.render(id, sourceCode);
              
              // Create a temp SVG element to pass to svgToPng
              const tempContainer = document.createElement('div');
              tempContainer.innerHTML = svg;
              const cleanSvg = tempContainer.querySelector('svg');
              
              if (cleanSvg) {
                 const pngDataUrl = await svgToPng(cleanSvg);
                 const img = document.createElement('img');
                 img.src = pngDataUrl;
                 img.style.maxWidth = '100%';
                 img.style.height = 'auto'; // Maintain aspect ratio
                 
                 cloneDiv.innerHTML = '';
                 cloneDiv.appendChild(img);
              }
            } catch (e) {
              console.error('Failed to export mermaid chart', e);
              // If re-render fails, try fallback to existing SVG (might fail security check, but worthless trying)
              cloneDiv.style.border = '1px dashed red';
              cloneDiv.innerText = t('errors.exportFail', { error: 'Chart export failed' });
            }
         }
       }
       
       // Restore default config if needed? Mermaid config is global, so this might affect live view if we re-render?
       // Live view uses mermaid.run which re-reads config? 
       // Better to reset:
       mermaid.initialize({ startOnLoad: false, htmlLabels: true, flowchart: { htmlLabels: true } });
    }

    // PDF Export Logic
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

    // HTML/DOCX Export Logic
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

      // Send processed HTML to backend
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

// Helper to convert SVG to PNG Data URL
const svgToPng = (svg: SVGSVGElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Serialize SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      
      // 2. Create base64 SVG URI
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // 3. Load into Image
      const img = new Image();
      img.onload = () => {
        // 4. Draw to Canvas
        const canvas = document.createElement('canvas');
        // Use styled size or bounding client rect
        const rect = svg.getBoundingClientRect();
        canvas.width = (rect.width || svg.viewBox.baseVal.width) * 2; // 2x scale
        canvas.height = (rect.height || svg.viewBox.baseVal.height) * 2;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           URL.revokeObjectURL(url);
           reject(new Error('Canvas context failed')); 
           return;
        }
        
        // Fill white background (important for dark mode SVG transparency)
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

const isModified = computed(() => {
  return content.value !== editorContent.value;
});

const shouldShowEditor = computed(() => {
  // If it's markdown, only show editor in Raw mode
  if (isMarkdown.value) return showRaw.value;
  // For other text files, always show editor
  return isTextFile.value;
});

const fileName = computed(() => props.filePath.split('/').pop() || 'Untitled');
const fileExtension = computed(() => props.filePath.split('.').pop()?.toLowerCase() || '');

// Use new file type system
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

import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { nextTick } from 'vue';
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

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

const isMarkdown = computed(() => fileExtension.value === 'md');
const breadcrumbs = computed(() => props.filePath.split('/').filter(p => p));

// Helper for image handling
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

      // Create directory and save file
      await invoke('create_dir', { path: attachmentsDir });
      await invoke('save_binary_file', { path: fullPath, data: Array.from(new Uint8Array(fileData)) });

      // Insert markdown reference at cursor
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

const editorExtensions = computed(() => {
  const extensions = [
    oneDark, 
    lintGutter(),
    EditorView.lineWrapping,
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
  
  // Use file type system to determine language support
  const language = fileTypeConfig.value.language;
  
  if (language === 'markdown') {
    extensions.push(markdown());
    // Table auto-complete keymap
    extensions.push(keymap.of([
      {
        key: 'Enter',
        run: (view) => {
          const line = view.state.doc.lineAt(view.state.selection.main.head);
          const text = line.text.trim();
          
          // If within a table row (starts/ends with |)
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
    
    // Basic linting for markdown
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
    // TypeScript/JavaScript support with syntax highlighting
    extensions.push(javascript({ typescript: language === 'typescript' }));
  } else if (language === 'json') {
    extensions.push(javascript()); // JSON uses JavaScript mode
  } else if (fileExtension.value === 'py') {
    extensions.push(python());
  } else if (fileExtension.value === 'rs') {
    extensions.push(rust());
  }
  
  return extensions;
});

const handleEditorChange = (value: string) => {
  editorContent.value = value;
};

const handleEditorReady = (payload: any) => {
  editorView.value = payload.view;
};

const saveFile = async () => {
  if (!props.filePath) return;
  
  saving.value = true;
  try {
    await invoke('write_file_content', { 
      path: props.filePath, 
      content: editorContent.value 
    });
    content.value = editorContent.value; // Sync original content
    console.log('File saved successfully');
  } catch (err: any) {
    console.error('Save failed:', err);
    error.value = t('errors.saveFail', { error: err });
  } finally {
    saving.value = false;
  }
};

// highlightedCode removed as it was unused

// Configure Marked to handle Mermaid code blocks and regular code blocks with highlighting
const renderer = new marked.Renderer();
const originalCode = renderer.code.bind(renderer);
renderer.code = (args: any) => {
  const { text, lang } = args;
  if (lang === 'mermaid') {
    const encoded = encodeURIComponent(text);
    return `<div class="mermaid-container my-4 bg-[#252525] p-4 rounded-lg overflow-x-auto"><pre class="mermaid" data-source="${encoded}">${text}</pre></div>`;
  }
  
  // Syntax highlighting for markdown code blocks
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre class="hljs leading-relaxed p-4 rounded bg-[#1a1a1a] my-2 overflow-x-auto"><code class="language-${lang}">${highlighted}</code></pre>`;
    } catch (e) {}
  }
  
  return originalCode(args);
};
marked.setOptions({ renderer });

const renderedMarkdown = ref('');

const updateMarkdown = async () => {
  if (!isMarkdown.value) {
    renderedMarkdown.value = '';
    return;
  }
  
  // Use editorContent for preview if in raw/edit mode, else use original content
  const source = showRaw.value ? editorContent.value : content.value;
  if (!source) {
    renderedMarkdown.value = '';
    return;
  }

  renderedMarkdown.value = await marked.parse(source);
  
  // Render Mermaid diagrams after DOM update
  nextTick(async () => {
    try {
      await mermaid.run({
        querySelector: '.mermaid',
      });
    } catch (e) {
      console.error('Mermaid rendering failed:', e);
    }
  });
};

watch([isMarkdown, content, showRaw, editorContent], () => {
  updateMarkdown();
});

// ... (existing helper functions)

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
      editorContent.value = fileContent; // Initialize editor content
      console.log('FileViewer: File loaded successfully, length:', content.value.length);
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

import { onUnmounted } from 'vue';

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (isModified.value) saveFile();
  }
};

onMounted(() => {
  console.log('FileViewer: Component mounted with filePath:', props.filePath);
  loadFileContent();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

watch(() => props.filePath, (newPath, oldPath) => {
  console.log('FileViewer: filePath changed from', oldPath, 'to', newPath);
  showRaw.value = false; // Reset to preview mode for new files
  loadFileContent();
});
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
