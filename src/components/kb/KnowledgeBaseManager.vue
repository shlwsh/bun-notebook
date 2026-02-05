<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useKnowledgeBaseStore } from '../../store/knowledgeBase';
import { open } from '@tauri-apps/plugin-dialog';
import { BookOpen, Plus, Trash2, Upload, FileText, ChevronRight } from 'lucide-vue-next';

const store = useKnowledgeBaseStore();
const showCreateDialog = ref(false);
const newKbName = ref('');
const newKbDescription = ref('');

const knowledgeBases = computed(() => store.knowledgeBases);
const documents = computed(() => store.documents);
const currentKb = computed(() => store.currentKnowledgeBase);
const loading = computed(() => store.loading);

onMounted(async () => {
  await store.loadKnowledgeBases();
});

async function createKb() {
  if (!newKbName.value.trim()) return;
  await store.createKnowledgeBase(newKbName.value, newKbDescription.value || undefined);
  newKbName.value = '';
  newKbDescription.value = '';
  showCreateDialog.value = false;
}

async function deleteKb(id: string) {
  if (confirm('确定要删除此知识库吗？所有文档将被删除。')) {
    await store.deleteKnowledgeBase(id);
  }
}

async function selectKb(id: string) {
  await store.selectKnowledgeBase(id);
}

async function importDocs() {
  if (!currentKb.value) return;
  const files = await open({
    multiple: true,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
    title: '选择要导入的 Markdown 文件',
  });
  if (files && Array.isArray(files)) {
    await store.importDocuments(currentKb.value.id, files);
  }
}

async function deleteDoc(docId: string) {
  if (confirm('确定要删除此文档吗？')) {
    await store.deleteDocument(docId);
  }
}
</script>

<template>
  <div class="kb-manager">
    <!-- 知识库列表 -->
    <div class="kb-sidebar">
      <div class="kb-header">
        <BookOpen :size="18" />
        <span>知识库</span>
        <button class="btn-icon" @click="showCreateDialog = true" title="新建知识库">
          <Plus :size="16" />
        </button>
      </div>

      <div class="kb-list">
        <div
          v-for="kb in knowledgeBases"
          :key="kb.id"
          class="kb-item"
          :class="{ active: currentKb?.id === kb.id }"
          @click="selectKb(kb.id)"
        >
          <div class="kb-info">
            <span class="kb-name">{{ kb.name }}</span>
            <span class="kb-count">{{ kb.documentCount }} 个文档</span>
          </div>
          <button class="btn-icon-sm" @click.stop="deleteKb(kb.id)" title="删除">
            <Trash2 :size="14" />
          </button>
        </div>

        <div v-if="knowledgeBases.length === 0" class="kb-empty">
          暂无知识库，点击 + 创建
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="doc-panel">
      <template v-if="currentKb">
        <div class="doc-header">
          <h3>{{ currentKb.name }}</h3>
          <button class="btn-primary" @click="importDocs">
            <Upload :size="16" />
            导入文档
          </button>
        </div>

        <p v-if="currentKb.description" class="kb-desc">{{ currentKb.description }}</p>

        <div class="doc-list">
          <div v-for="doc in documents" :key="doc.id" class="doc-item">
            <FileText :size="18" class="doc-icon" />
            <div class="doc-info">
              <span class="doc-title">{{ doc.title }}</span>
              <span class="doc-meta">
                {{ doc.metadata.wordCount }} 字 · {{ doc.metadata.lineCount }} 行
              </span>
            </div>
            <button class="btn-icon-sm" @click="deleteDoc(doc.id)" title="删除">
              <Trash2 :size="14" />
            </button>
          </div>

          <div v-if="documents.length === 0" class="doc-empty">
            <FileText :size="48" class="empty-icon" />
            <p>暂无文档</p>
            <p class="hint">点击"导入文档"添加 Markdown 文件</p>
          </div>
        </div>
      </template>

      <div v-else class="doc-placeholder">
        <ChevronRight :size="32" />
        <p>选择左侧知识库查看文档</p>
      </div>
    </div>

    <!-- 创建对话框 -->
    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog">
        <h3>创建知识库</h3>
        <input
          v-model="newKbName"
          type="text"
          placeholder="知识库名称"
          class="input"
          @keyup.enter="createKb"
        />
        <textarea
          v-model="newKbDescription"
          placeholder="描述（可选）"
          class="input textarea"
          rows="3"
        />
        <div class="dialog-actions">
          <button class="btn-secondary" @click="showCreateDialog = false">取消</button>
          <button class="btn-primary" @click="createKb" :disabled="!newKbName.trim()">
            创建
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.kb-manager {
  display: flex;
  height: 100%;
  background: var(--bg-primary);
}

.kb-sidebar {
  width: 260px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.kb-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
}

.kb-header .btn-icon {
  margin-left: auto;
}

.kb-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.kb-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.kb-item:hover {
  background: var(--bg-hover);
}

.kb-item.active {
  background: var(--bg-active);
}

.kb-info {
  flex: 1;
  min-width: 0;
}

.kb-name {
  display: block;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kb-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.kb-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
}

.doc-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.doc-header h3 {
  margin: 0;
  font-size: 18px;
}

.kb-desc {
  padding: 0 20px;
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.doc-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 8px;
  transition: border-color 0.15s;
}

.doc-item:hover {
  border-color: var(--accent-color);
}

.doc-icon {
  color: var(--accent-color);
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-title {
  display: block;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-meta {
  font-size: 12px;
  color: var(--text-secondary);
}

.doc-empty, .doc-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.empty-icon {
  opacity: 0.3;
  margin-bottom: 16px;
}

.hint {
  font-size: 13px;
  margin-top: 4px;
}

/* 按钮样式 */
.btn-icon, .btn-icon-sm {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover, .btn-icon-sm:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 8px 16px;
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: var(--bg-primary);
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 90vw;
}

.dialog h3 {
  margin: 0 0 20px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.textarea {
  resize: vertical;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

/* Loading */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
