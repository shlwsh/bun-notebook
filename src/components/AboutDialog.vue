<template>
  <Teleport to="body">
    <div 
      v-if="modelValue"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] backdrop-blur-sm"
      @click="closeDialog"
    >
      <div 
        class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden border border-gray-700"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-bold">Markdown 编辑器</h2>
              <button 
                @click="closeDialog"
                class="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              >
                <X :size="24" />
              </button>
            </div>
            <p class="text-blue-100 text-sm">Bun Markdown Editor - 专注于文档编辑与预览</p>
            <div class="mt-3 flex items-center gap-2">
              <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-mono">{{ version }}</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(85vh-180px)] text-gray-300">
          <!-- Main Features -->
          <section class="mb-6">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles :size="20" class="text-blue-400" />
              主要功能
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-blue-500/10 rounded-lg">
                    <FileCode :size="20" class="text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white mb-1">Markdown 编辑</h4>
                    <p class="text-sm text-gray-400">专业级 CodeMirror 6 编辑器，支持语法高亮和实时预览</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-purple-500/10 rounded-lg">
                    <Network :size="20" class="text-purple-400" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white mb-1">Mermaid 图表</h4>
                    <p class="text-sm text-gray-400">内置 Mermaid 支持，实时渲染流程图和图表</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-green-500/10 rounded-lg">
                    <Search :size="20" class="text-green-400" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white mb-1">文件浏览</h4>
                    <p class="text-sm text-gray-400">树形文件浏览器，快速定位和打开文档</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-orange-500/10 rounded-lg">
                    <BookOpen :size="20" class="text-orange-400" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-white mb-1">文档导出</h4>
                    <p class="text-sm text-gray-400">支持导出为 HTML、PDF、DOCX 格式</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Usage Guide -->
          <section class="mb-6">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BookText :size="20" class="text-green-400" />
              使用说明
            </h3>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 space-y-3">
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p class="text-sm"><span class="font-semibold text-white">打开项目：</span>点击顶部工具栏的文件夹图标（Ctrl+O），选择包含 Markdown 文件的目录</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p class="text-sm"><span class="font-semibold text-white">编辑文档：</span>在左侧文件树中点击 .md 文件，可在预览和编辑模式间切换</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p class="text-sm"><span class="font-semibold text-white">保存文件：</span>修改后点击保存按钮或使用 Ctrl+S 快捷键保存</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <p class="text-sm"><span class="font-semibold text-white">导出文档：</span>点击导出按钮，选择 HTML、PDF 或 DOCX 格式另存</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <p class="text-sm"><span class="font-semibold text-white">图片插入：</span>在编辑模式下，直接拖拽或粘贴图片，自动保存到 attachments 目录</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Copyright & Disclaimer -->
          <section class="mb-4">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Shield :size="20" class="text-yellow-400" />
              版权及免责声明
            </h3>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 space-y-3 text-sm">
              <div>
                <p class="text-white font-semibold mb-1">© 版权所有</p>
                <p class="text-gray-400">著作权人：<span class="text-blue-400 font-semibold">笨笨熊</span></p>
                <p class="text-gray-400 text-xs mt-1">本软件受著作权法保护，未经授权不得复制、修改或分发。</p>
              </div>
              
              <div class="border-t border-gray-700 pt-3">
                <p class="text-white font-semibold mb-1">免责声明</p>
                <ul class="text-gray-400 text-xs space-y-1 list-disc list-inside">
                  <li>本软件按"现状"提供，不提供任何明示或暗示的保证</li>
                  <li>使用本软件产生的任何直接或间接损失，开发者不承担责任</li>
                  <li>用户应遵守所在地区的法律法规，合法使用本软件</li>
                  <li>本软件仅供学习和研究使用，不得用于商业用途</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Technical Info -->
          <section>
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Code :size="20" class="text-purple-400" />
              技术信息
            </h3>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-500">前端框架：</span>
                  <span class="text-gray-300">Vue 3 + TypeScript</span>
                </div>
                <div>
                  <span class="text-gray-500">桌面框架：</span>
                  <span class="text-gray-300">Tauri 2</span>
                </div>
                <div>
                  <span class="text-gray-500">后端语言：</span>
                  <span class="text-gray-300">Rust</span>
                </div>
                <div>
                  <span class="text-gray-500">构建工具：</span>
                  <span class="text-gray-300">Vite + Bun</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-800/50 border-t border-gray-700 p-4 flex items-center justify-between">
          <p class="text-xs text-gray-500">
            Made with ❤️ by 笨笨熊
          </p>
          <button
            @click="closeDialog"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  X, Sparkles, FileCode, Network, Search, BookOpen, 
  BookText, Shield, Code 
} from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const version = ref('Ver:1.0.20260206.003');

const closeDialog = () => {
  emit('update:modelValue', false);
};

onMounted(async () => {
  try {
    const response = await fetch('/version.json');
    const data = await response.json();
    version.value = data.version;
  } catch (error) {
    console.error('Failed to load version info:', error);
  }
});
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
