import { defineStore } from 'pinia';

export interface Tab {
    id: string;
    title: string;
    path: string;
    icon: string;
    closable: boolean;
}

export const useNavStore = defineStore('navigation', {
    state: () => ({
        activeView: 'files' as 'files' | 'search',
        tabs: [] as Tab[],
        activeTabId: '',
    }),
    actions: {
        setActiveView(view: 'files' | 'search') {
            this.activeView = view;
        },
        openTab(tab: Omit<Tab, 'closable'> & { closable?: boolean }) {
            const existing = this.tabs.find(t => t.id === tab.id);
            if (!existing) {
                this.tabs.push({ ...tab, closable: tab.closable ?? true });
            }
            this.activeTabId = tab.id;
        },
        closeTab(tabId: string) {
            const index = this.tabs.findIndex(t => t.id === tabId);
            if (index === -1) return;

            this.tabs.splice(index, 1);
            if (this.activeTabId === tabId) {
                this.activeTabId = this.tabs.length > 0 ? this.tabs[Math.max(0, index - 1)].id : '';
            }
        },
        setActiveTab(tabId: string) {
            this.activeTabId = tabId;
        },
        closeOtherTabs(tabId: string) {
            this.tabs = this.tabs.filter(t => t.id === tabId);
            this.activeTabId = tabId;
        },
        closeAllTabs() {
            this.tabs = [];
            this.activeTabId = '';
        }
    }
});
