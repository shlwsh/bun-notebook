import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
// @ts-ignore
import i18n from '../i18n';

export const useAppStore = defineStore('app', {
    state: () => ({
        projectPath: '',
        recentProjects: [] as string[],
        clipboardPath: null as string | null,
        theme: 'dark' as 'dark' | 'light',
        fileTreeFontSize: 13 as number,
        locale: 'en' as 'en' | 'zh' | 'ru' | 'ja' | 'fr' | 'de',
        // 自动保存配置
        autoSave: true,
        autoSaveDelay: 3000, // 毫秒
    }),

    actions: {
        setTheme(theme: 'dark' | 'light') {
            this.theme = theme;
        },

        setLocale(locale: 'en' | 'zh' | 'ru' | 'ja' | 'fr' | 'de') {
            this.locale = locale;
            if (i18n.global) {
                i18n.global.locale.value = locale;
            }
        },

        setFileTreeFontSize(size: number) {
            this.fileTreeFontSize = size;
        },

        setClipboard(path: string) {
            this.clipboardPath = path;
        },

        clearClipboard() {
            this.clipboardPath = null;
        },

        setProjectPath(path: string) {
            this.projectPath = path;
        },

        setAutoSave(enabled: boolean) {
            this.autoSave = enabled;
        },

        setAutoSaveDelay(delay: number) {
            this.autoSaveDelay = delay;
        },

        async loadRecentProjects() {
            try {
                const projects: string[] = await invoke('get_project_history');
                this.recentProjects = projects;
            } catch (error) {
                console.error('Failed to load recent projects:', error);
            }
        },

        async addToRecentProjects(path: string) {
            try {
                await invoke('add_project_to_history', { path });
                const projects: string[] = await invoke('get_project_history');
                this.recentProjects = projects;
            } catch (error) {
                console.error('Failed to add project to history:', error);
            }
        },

        async clearRecentProjects() {
            try {
                await invoke('clear_project_history');
                this.recentProjects = [];
            } catch (error) {
                console.error('Failed to clear project history:', error);
            }
        },

        async openProjectDialog() {
            try {
                const selected = await open({
                    directory: true,
                    multiple: false,
                    title: '选择项目目录',
                });

                if (selected && typeof selected === 'string') {
                    this.projectPath = selected;
                    await this.addToRecentProjects(selected);
                }
            } catch (error) {
                console.error('Failed to open project dialog:', error);
            }
        },
    },
});
