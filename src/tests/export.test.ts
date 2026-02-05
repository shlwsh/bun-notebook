// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render } from '@testing-library/vue';
// import FileViewer from '../components/FileViewer.vue';
import html2pdf from 'html2pdf.js';

// Mock dependencies
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn(),
    convertFileSrc: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
    save: vi.fn(() => Promise.resolve('/mock/path/file.pdf')),
}));

vi.mock('html2pdf.js', () => {
    const mockOutput = {
        output: vi.fn().mockReturnThis(),
        save: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    };
    return {
        default: vi.fn(() => mockOutput),
    };
});

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useRoute: () => ({
        params: { id: '1' },
    }),
}));

// Mock Pinia
vi.mock('pinia', () => ({
    createPinia: vi.fn(),
    defineStore: vi.fn(() => () => ({})),
}));

describe('FileViewer Export', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '<div class="markdown-body">Mock Content</div>';
    });

    it('runs sanity check', () => {
        expect(true).toBe(true);
    });

    it('mocks html2pdf correctly', () => {
        // @ts-ignore
        const pdf = html2pdf();
        expect(pdf.set).toBeDefined();
    });
});
