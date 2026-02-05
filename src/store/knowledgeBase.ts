import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/core';
import type { KnowledgeBase, Document } from '../types/knowledgeBase';

interface KnowledgeBaseState {
    knowledgeBases: KnowledgeBase[];
    currentKbId: string | null;
    documents: Document[];
    loading: boolean;
    error: string | null;
}

export const useKnowledgeBaseStore = defineStore('knowledgeBase', {
    state: (): KnowledgeBaseState => ({
        knowledgeBases: [],
        currentKbId: null,
        documents: [],
        loading: false,
        error: null,
    }),

    getters: {
        currentKnowledgeBase: (state): KnowledgeBase | undefined => {
            return state.knowledgeBases.find(kb => kb.id === state.currentKbId);
        },
    },

    actions: {
        /** 加载所有知识库 */
        async loadKnowledgeBases() {
            this.loading = true;
            this.error = null;
            try {
                this.knowledgeBases = await invoke<KnowledgeBase[]>('list_knowledge_bases');
            } catch (e) {
                this.error = String(e);
                console.error('加载知识库失败:', e);
            } finally {
                this.loading = false;
            }
        },

        /** 创建知识库 */
        async createKnowledgeBase(name: string, description?: string) {
            this.loading = true;
            try {
                const kb = await invoke<KnowledgeBase>('create_knowledge_base', {
                    name,
                    description,
                });
                this.knowledgeBases.push(kb);
                return kb;
            } catch (e) {
                this.error = String(e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        /** 删除知识库 */
        async deleteKnowledgeBase(id: string) {
            this.loading = true;
            try {
                await invoke('delete_knowledge_base', { id });
                this.knowledgeBases = this.knowledgeBases.filter(kb => kb.id !== id);
                if (this.currentKbId === id) {
                    this.currentKbId = null;
                    this.documents = [];
                }
            } catch (e) {
                this.error = String(e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        /** 选择知识库 */
        async selectKnowledgeBase(id: string) {
            this.currentKbId = id;
            await this.loadDocuments(id);
        },

        /** 加载文档列表 */
        async loadDocuments(kbId: string) {
            this.loading = true;
            try {
                this.documents = await invoke<Document[]>('get_documents', { kbId });
            } catch (e) {
                this.error = String(e);
                console.error('加载文档失败:', e);
            } finally {
                this.loading = false;
            }
        },

        /** 导入文档 */
        async importDocuments(kbId: string, paths: string[]) {
            this.loading = true;
            try {
                const docs = await invoke<Document[]>('import_documents', { kbId, paths });
                this.documents.push(...docs);
                // 更新知识库文档数
                const kb = this.knowledgeBases.find(k => k.id === kbId);
                if (kb) {
                    kb.documentCount = this.documents.length;
                }
                return docs;
            } catch (e) {
                this.error = String(e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        /** 删除文档 */
        async deleteDocument(docId: string) {
            this.loading = true;
            try {
                await invoke('delete_document', { docId });
                this.documents = this.documents.filter(doc => doc.id !== docId);
                // 更新知识库文档数
                if (this.currentKbId) {
                    const kb = this.knowledgeBases.find(k => k.id === this.currentKbId);
                    if (kb) {
                        kb.documentCount = this.documents.length;
                    }
                }
            } catch (e) {
                this.error = String(e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        /** 清除错误 */
        clearError() {
            this.error = null;
        },
    },
});
