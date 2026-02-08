<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="px-3 py-2 text-[10px] text-[#858585] uppercase tracking-wider border-b border-[#2b2b2b]">
      {{ $t('outline.title') }}
    </div>
    <div class="flex-1 overflow-auto custom-scrollbar p-1">
      <div v-if="headings.length === 0" class="text-center text-[#858585] text-xs py-8">
        {{ $t('outline.empty') }}
      </div>
      <div
        v-for="heading in headings"
        :key="`${heading.line}-${heading.text}`"
        @click="scrollToHeading(heading)"
        class="flex items-center gap-1.5 px-2 py-1 text-xs cursor-pointer rounded
               hover:bg-[#2a2a2a] text-[#cccccc] transition-colors truncate"
        :style="{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }"
        :title="heading.text"
      >
        <span class="text-[#858585] text-[10px] font-mono shrink-0 w-4">H{{ heading.level }}</span>
        <span class="truncate">{{ heading.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNavStore, type HeadingItem } from '../../store/navigation';

const navStore = useNavStore();
const { headings } = storeToRefs(navStore);

const scrollToHeading = (heading: HeadingItem) => {
  // 尝试在预览面板中查找对应标题并滚动
  const previewEl = document.querySelector('.markdown-body');
  if (previewEl) {
    const headingEls = previewEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const el of headingEls) {
      if (el.textContent?.trim() === heading.text.trim()) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  }

  // 如果预览面板中没找到，尝试在编辑器中跳转
  const cmEditor = document.querySelector('.cm-editor') as any;
  if (cmEditor?.cmView?.view) {
    const view = cmEditor.cmView.view;
    const line = view.state.doc.line(Math.min(heading.line, view.state.doc.lines));
    view.dispatch({
      selection: { anchor: line.from },
      scrollIntoView: true,
    });
    view.focus();
  }
};
</script>
