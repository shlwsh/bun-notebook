import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        sidebarWidth: 300,
        sidebarVisible: true,
        panelHeight: 200,
        panelVisible: false,
        editorLayout: 'single' as 'single' | 'horizontal' | 'vertical',
    }),
    actions: {
        setSidebarWidth(width: number) {
            this.sidebarWidth = Math.max(200, Math.min(600, width));
        },
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        setPanelHeight(height: number) {
            this.panelHeight = Math.max(100, Math.min(500, height));
        },
        togglePanel() {
            this.panelVisible = !this.panelVisible;
        },
        setEditorLayout(layout: 'single' | 'horizontal' | 'vertical') {
            this.editorLayout = layout;
        },
    },
});
