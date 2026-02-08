<template>
  <div class="h-10 flex items-center gap-1 px-3 bg-[#252525] border-b border-[#2b2b2b]">
    <!-- Heading Dropdown -->
    <div class="relative">
      <button
        @click="showHeadingMenu = !showHeadingMenu"
        class="flex items-center gap-1 px-2 py-1 hover:bg-[#3e3e3e] rounded text-[#cccccc] text-xs transition-colors"
        :title="$t('markdownToolbar.heading')"
      >
        <Heading :size="16" />
        <ChevronDown :size="12" class="opacity-50" />
      </button>

      <!-- Heading Dropdown Menu -->
      <div
        v-if="showHeadingMenu"
        class="absolute top-full left-0 mt-1 w-32 bg-[#252525] border border-[#3e3e3e] rounded shadow-xl z-50 py-1"
        v-click-outside="() => showHeadingMenu = false"
      >
        <button
          v-for="level in [1, 2, 3, 4, 5, 6]"
          :key="level"
          @click="handleHeading(level)"
          class="w-full text-left px-3 py-1.5 text-[#cccccc] hover:bg-blue-600 hover:text-white transition-colors"
          :style="{ fontSize: `${18 - level}px` }"
        >
          {{ $t('markdownToolbar.headingLevel', { level }) }}
        </button>
      </div>
    </div>

    <div class="w-px h-5 bg-[#3e3e3e]"></div>

    <!-- Bold -->
    <button
      @click="handleBold"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.bold')} (${modKey}+B)`"
    >
      <Bold :size="16" />
    </button>

    <!-- Italic -->
    <button
      @click="handleItalic"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.italic')} (${modKey}+I)`"
    >
      <Italic :size="16" />
    </button>

    <!-- Strikethrough -->
    <button
      @click="handleStrikethrough"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.strikethrough')} (${modKey}+Shift+X)`"
    >
      <Strikethrough :size="16" />
    </button>

    <div class="w-px h-5 bg-[#3e3e3e]"></div>

    <!-- Unordered List -->
    <button
      @click="handleUnorderedList"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.unorderedList')"
    >
      <List :size="16" />
    </button>

    <!-- Ordered List -->
    <button
      @click="handleOrderedList"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.orderedList')"
    >
      <ListOrdered :size="16" />
    </button>

    <!-- Task List -->
    <button
      @click="handleTaskList"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.taskList')"
    >
      <CheckSquare :size="16" />
    </button>

    <div class="w-px h-5 bg-[#3e3e3e]"></div>

    <!-- Table -->
    <button
      @click="handleTable"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.table')"
    >
      <Table :size="16" />
    </button>

    <!-- Link -->
    <button
      @click="handleLink"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.link')} (${modKey}+K)`"
    >
      <Link :size="16" />
    </button>

    <!-- Image -->
    <button
      @click="handleImage"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.image')"
    >
      <ImageIcon :size="16" />
    </button>

    <!-- Code Block -->
    <button
      @click="handleCodeBlock"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.codeBlock')} (${modKey}+Shift+K)`"
    >
      <Code :size="16" />
    </button>

    <!-- Quote -->
    <button
      @click="handleQuote"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.quote')"
    >
      <Quote :size="16" />
    </button>

    <!-- Horizontal Rule -->
    <button
      @click="handleHorizontalRule"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="$t('markdownToolbar.horizontalRule')"
    >
      <Minus :size="16" />
    </button>

    <div class="w-px h-5 bg-[#3e3e3e]"></div>

    <!-- Undo -->
    <button
      @click="handleUndo"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.undo')} (${modKey}+Z)`"
    >
      <Undo2 :size="16" />
    </button>

    <!-- Redo -->
    <button
      @click="handleRedo"
      class="p-1.5 hover:bg-[#3e3e3e] rounded text-[#cccccc] hover:text-white transition-colors"
      :title="`${$t('markdownToolbar.redo')} (${modKey}+Shift+Z)`"
    >
      <Redo2 :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Heading, Bold, Italic, Strikethrough,
  List, ListOrdered, Table, Link,
  Image as ImageIcon, Code, Quote, ChevronDown,
  CheckSquare, Minus, Undo2, Redo2
} from 'lucide-vue-next';
import { EditorView } from '@codemirror/view';
import { undo, redo } from '@codemirror/commands';
import {
  wrapSelection,
  insertHeading,
  insertList,
  insertTable,
  insertLink,
  insertImage,
  insertCodeBlock,
  insertQuote,
  insertHorizontalRule,
  insertTaskList
} from '../../utils/markdownOperations';

const { t } = useI18n();

const props = defineProps<{
  editorView?: EditorView;
}>();

const showHeadingMenu = ref(false);

// 检测平台
const modKey = navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl';

const handleHeading = (level: number) => {
  if (props.editorView) {
    insertHeading(props.editorView, level);
  }
  showHeadingMenu.value = false;
};

const handleBold = () => {
  if (props.editorView) {
    wrapSelection(props.editorView, '**');
  }
};

const handleItalic = () => {
  if (props.editorView) {
    wrapSelection(props.editorView, '*');
  }
};

const handleStrikethrough = () => {
  if (props.editorView) {
    wrapSelection(props.editorView, '~~');
  }
};

const handleUnorderedList = () => {
  if (props.editorView) {
    insertList(props.editorView, false);
  }
};

const handleOrderedList = () => {
  if (props.editorView) {
    insertList(props.editorView, true);
  }
};

const handleTaskList = () => {
  if (props.editorView) {
    insertTaskList(props.editorView);
  }
};

const handleTable = () => {
  if (props.editorView) {
    insertTable(props.editorView, 3, 3);
  }
};

const handleLink = () => {
  if (props.editorView) {
    insertLink(props.editorView);
  }
};

const handleImage = () => {
  if (props.editorView) {
    insertImage(props.editorView);
  }
};

const handleCodeBlock = () => {
  if (props.editorView) {
    insertCodeBlock(props.editorView);
  }
};

const handleQuote = () => {
  if (props.editorView) {
    insertQuote(props.editorView);
  }
};

const handleHorizontalRule = () => {
  if (props.editorView) {
    insertHorizontalRule(props.editorView);
  }
};

const handleUndo = () => {
  if (props.editorView) {
    undo(props.editorView);
  }
};

const handleRedo = () => {
  if (props.editorView) {
    redo(props.editorView);
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
</script>

<style scoped>
/* Toolbar styles are inline */
</style>
