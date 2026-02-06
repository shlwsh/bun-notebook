import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        toolbar: {
            openAgent: 'Open Agent Manager',
            toggleSidebar: 'Toggle Sidebar',
            toggleTheme: {
                light: 'Switch to Light Mode',
                dark: 'Switch to Dark Mode'
            },
            openFolder: 'Open Folder',
            settings: 'Settings',
            fontSize: 'File Tree Font Size',
            language: 'Language'
        },
        explorer: {
            title: 'Explorer',
            newFile: 'New File',
            newFolder: 'New Folder',
            refresh: 'Refresh',
            openFolder: 'Open Folder',
            filterMd: 'Show Markdown Only',
            expandAll: 'Expand All',
            collapseAll: 'Collapse All',
            searchPlaceholder: 'Search files...',
            emptySearch: 'No matching files found',
            emptyFolder: 'Folder is empty or unreadable',
            selectFolder: 'Select New Folder',
            create: 'Create',
            fileNamePlaceholder: 'File name (e.g. notes.md)',
            folderNamePlaceholder: 'Folder name',
            loading: 'Loading project...',
            error: 'Error loading project',
            retry: 'Retry'
        },
        contextMenu: {
            rename: 'Rename',
            copy: 'Copy Path',
            paste: 'Paste',
            duplicate: 'Duplicate',
            delete: 'Delete'
        },
        activityBar: {
            explorer: 'Explorer',
            search: 'Search'
        },
        search: {
            placeholder: 'Search in files...',
            hint: 'Press Enter to search',
            count: '{count} files found',
            searching: 'Searching...',
            noResults: 'No results found for "{query}"',
            moreMatches: '{count} more matches...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: 'Select a file to start editing',
            saveShortcut: '⌘ + S to Save',
            tableShortcut: 'Enter for Table Auto-complete',
            closeCurrent: 'Close Current',
            closeOthers: 'Close Others',
            closeAll: 'Close All'
        },
        fileViewer: {
            save: 'Save',
            saving: 'Saving...',
            preview: 'Preview',
            raw: 'Raw',
            theme: 'Theme',
            export: 'Export',
            print: 'Print',
            exportHtml: 'Export to HTML',
            exportPdf: 'Export to PDF',
            exportDocx: 'Export to Word',
            empty: 'File is empty',
            unsupported: 'Unsupported file type',
            themeNames: {
                default: 'Default Dark',
                light: 'Light Mode',
                sepia: 'Sepia',
                github: 'GitHub'
            }
        },
        markdownToolbar: {
            heading: 'Heading',
            headingLevel: 'Heading {level}',
            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Strikethrough',
            unorderedList: 'Unordered List',
            orderedList: 'Ordered List',
            table: 'Insert Table',
            link: 'Insert Link',
            image: 'Insert Image',
            codeBlock: 'Code Block',
            quote: 'Quote'
        },
        menuBar: {
            file: '文件',
            openFolder: '打开文件夹...',
            refresh: '刷新',
            view: '查看',
            toggleSidebar: '切换侧边栏',
            help: '帮助',
            about: '关于'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: '专注于 MD 文件的查看与编辑',
            confirmDelete: '确定要删除 {name} 吗？'
        },
        errors: {
            componentError: '组件渲染错误',
            retry: '重试',
            createFail: '创建失败: {error}',
            createFolderFail: '创建文件夹失败: {error}',
            loadFail: '加载失败: {error}',
            renameFail: '重命名失败: {error}',
            pasteFail: '粘贴失败: {error}',
            duplicateFail: '创建副本失败: {error}',
            deleteFail: '删除失败: {error}',
            exportSuccess: '🎉 成功导出至: {path}',
            exportFail: '导出失败: {error}',
            contentNotFound: '无法找到文档内容'
        }
    },
    zh: {
        toolbar: {
            openAgent: '打开 Agent 管理器',
            toggleSidebar: '切换侧边栏',
            toggleTheme: {
                light: '切换到亮色模式',
                dark: '切换到暗色模式'
            },
            openFolder: '打开文件夹',
            settings: '设置',
            fontSize: '文件树字体大小',
            language: '语言'
        },
        explorer: {
            title: '资源管理器',
            newFile: '新建文件',
            newFolder: '新建文件夹',
            refresh: '刷新',
            openFolder: '打开文件夹',
            filterMd: '仅显示 Markdown',
            expandAll: '全部展开',
            collapseAll: '全部收起',
            searchPlaceholder: '搜索文件...',
            emptySearch: '没有找到匹配的文件',
            emptyFolder: '此目录为空或无法读取',
            selectFolder: '选择新文件夹',
            create: '创建',
            fileNamePlaceholder: '文件名 (如: notes.md)',
            folderNamePlaceholder: '文件夹名称',
            loading: '正在读取项目...',
            error: '读取项目失败',
            retry: '重试'
        },
        contextMenu: {
            rename: '重命名',
            copy: '复制路径',
            paste: '粘贴',
            duplicate: '创建副本',
            delete: '删除'
        },
        activityBar: {
            explorer: '资源管理器',
            search: '全文搜索'
        },
        search: {
            placeholder: '搜索项目中的内容...',
            hint: '按回车开始搜索',
            count: '{count} 个文件匹配',
            searching: '正在搜索...',
            noResults: '未找到包含 "{query}" 的内容',
            moreMatches: '还有 {count} 个匹配项...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: '从左侧选择并打开一个 MD 文件开始工作',
            saveShortcut: '⌘ + S 保存',
            tableShortcut: 'Enter 表格自动补全',
            closeCurrent: '关闭当前',
            closeOthers: '关闭其他内容',
            closeAll: '关闭全部内容'
        },
        fileViewer: {
            save: '保存更改',
            saving: '正在保存...',
            preview: '预览',
            raw: '源码',
            theme: '主题',
            export: '导出',
            print: '打印',
            exportHtml: '导出为 HTML',
            exportPdf: '导出为 PDF',
            exportDocx: '导出为 Word',
            empty: '文件内容为空',
            unsupported: '不支持预览此文件类型',
            themeNames: {
                default: '默认暗色',
                light: '亮色模式',
                sepia: '护眼模式',
                github: 'GitHub'
            }
        },
        markdownToolbar: {
            heading: '标题',
            headingLevel: '标题 {level}',
            bold: '粗体',
            italic: '斜体',
            strikethrough: '删除线',
            unorderedList: '无序列表',
            orderedList: '有序列表',
            table: '插入表格',
            link: '插入链接',
            image: '插入图片',
            codeBlock: '代码块',
            quote: '引用'
        },
        menuBar: {
            file: 'ファイル',
            openFolder: 'フォルダを開く...',
            refresh: '更新',
            view: '表示',
            toggleSidebar: 'サイドバーの切り替え',
            help: 'ヘルプ',
            about: '詳細'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: 'MDファイルの閲覧と編集に特化',
            confirmDelete: '{name} を削除してもよろしいですか？'
        },
        errors: {
            componentError: 'コンポーネントのレンダリングエラー',
            retry: '再試行',
            createFail: '作成失敗: {error}',
            createFolderFail: 'フォルダ作成失敗: {error}',
            loadFail: '読み込み失敗: {error}',
            renameFail: '名前変更失敗: {error}',
            pasteFail: '貼り付け失敗: {error}',
            duplicateFail: '複製失敗: {error}',
            deleteFail: '削除失敗: {error}',
            exportSuccess: '🎉 エクスポート成功: {path}',
            exportFail: 'エクスポート失敗: {error}',
            contentNotFound: 'コンテンツが見つかりません'
        }
    },
    ru: {
        toolbar: {
            openAgent: 'Открыть менеджер агентов',
            toggleSidebar: 'Переключить боковую панель',
            toggleTheme: {
                light: 'Включить светлую тему',
                dark: 'Включить тёмную тему'
            },
            openFolder: 'Открыть папку',
            settings: 'Настройки',
            fontSize: 'Размер шрифта',
            language: 'Язык'
        },
        explorer: {
            title: 'Проводник',
            newFile: 'Новый файл',
            newFolder: 'Новая папка',
            refresh: 'Обновить',
            openFolder: 'Открыть папку',
            filterMd: 'Только Markdown',
            expandAll: 'Развернуть всё',
            collapseAll: 'Свернуть всё',
            searchPlaceholder: 'Поиск файлов...',
            emptySearch: 'Файлы не найдены',
            emptyFolder: 'Папка пуста или недоступна',
            selectFolder: 'Выбрать папку',
            create: 'Создать',
            fileNamePlaceholder: 'Имя файла (напр. notes.md)',
            folderNamePlaceholder: 'Имя папки',
            loading: 'Загрузка проекта...',
            error: 'Ошибка загрузки',
            retry: 'Повторить'
        },
        contextMenu: {
            rename: 'Переименовать',
            copy: 'Копировать путь',
            paste: 'Вставить',
            duplicate: 'Дублировать',
            delete: 'Удалить'
        },
        activityBar: {
            explorer: 'Проводник',
            search: 'Поиск'
        },
        search: {
            placeholder: 'Поиск в файлах...',
            hint: 'Нажмите Enter для поиска',
            count: 'Найдено файлов: {count}',
            searching: 'Поиск...',
            noResults: 'Ничего не найдено по запросу "{query}"',
            moreMatches: 'Ещё {count} совпадений...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: 'Выберите файл для редактирования',
            saveShortcut: '⌘ + S Сохранить',
            tableShortcut: 'Enter Автодополнение таблиц',
            closeCurrent: 'Закрыть текущую',
            closeOthers: 'Закрыть другие',
            closeAll: 'Закрыть все'
        },
        fileViewer: {
            save: 'Сохранить',
            saving: 'Сохранение...',
            preview: 'Просмотр',
            raw: 'Код',
            theme: 'Тема',
            export: 'Экспорт',
            print: 'Печать',
            exportHtml: 'Экспорт в HTML',
            exportPdf: 'Экспорт в PDF',
            exportDocx: 'Экспорт в Word',
            empty: 'Файл пуст',
            unsupported: 'Тип файла не поддерживается',
            themeNames: {
                default: 'Тёмная (по умолч.)',
                light: 'Светлая',
                sepia: 'Сепия',
                github: 'GitHub'
            }
        },
        menuBar: {
            file: 'Файл',
            openFolder: 'Открыть папку...',
            refresh: 'Обновить',
            view: 'Вид',
            toggleSidebar: 'Переключить боковую панель',
            help: 'Справка',
            about: 'О программе'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: 'Ориентирован на просмотр и редактирование MD файлов',
            confirmDelete: 'Вы уверены, что хотите удалить {name}?'
        },
        errors: {
            componentError: 'Ошибка рендеринга компонента',
            retry: 'Повторить',
            createFail: 'Ошибка создания: {error}',
            createFolderFail: 'Ошибка создания папки: {error}',
            loadFail: 'Ошибка загрузки: {error}',
            renameFail: 'Ошибка переименования: {error}',
            pasteFail: 'Ошибка вставки: {error}',
            duplicateFail: 'Ошибка дублирования: {error}',
            deleteFail: 'Ошибка удаления: {error}',
            exportSuccess: '🎉 Успешно экспортировано в: {path}',
            exportFail: 'Ошибка экспорта: {error}',
            contentNotFound: 'Контент не найден'
        }
    },
    ja: {
        toolbar: {
            openAgent: 'エージェントマネージャーを開く',
            toggleSidebar: 'サイドバーの切り替え',
            toggleTheme: {
                light: 'ライトモードに切り替え',
                dark: 'ダークモードに切り替え'
            },
            openFolder: 'フォルダを開く',
            settings: '設定',
            fontSize: 'フォントサイズ',
            language: '言語'
        },
        explorer: {
            title: 'エクスプローラー',
            newFile: '新規ファイル',
            newFolder: '新規フォルダ',
            refresh: '更新',
            openFolder: 'フォルダを開く',
            filterMd: 'Markdownのみ表示',
            expandAll: 'すべて展開',
            collapseAll: 'すべて折りたたむ',
            searchPlaceholder: 'ファイルを検索...',
            emptySearch: '一致するファイルがありません',
            emptyFolder: 'フォルダが空か読み込めません',
            selectFolder: 'フォルダを選択',
            create: '作成',
            fileNamePlaceholder: 'ファイル名 (例: notes.md)',
            folderNamePlaceholder: 'フォルダ名',
            loading: 'プロジェクトを読み込み中...',
            error: '読み込みエラー',
            retry: '再試行'
        },
        contextMenu: {
            rename: '名前の変更',
            copy: 'パスをコピー',
            paste: '貼り付け',
            duplicate: '複製',
            delete: '削除'
        },
        activityBar: {
            explorer: 'エクスプローラー',
            search: '検索'
        },
        search: {
            placeholder: 'ファイルを検索...',
            hint: 'Enterキーで検索',
            count: '{count} 個のファイルが見つかりました',
            searching: '検索中...',
            noResults: '"{query}" に一致するものは見つかりませんでした',
            moreMatches: '他 {count} 件...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: '左側のファイルを選択して編集を開始',
            saveShortcut: '⌘ + S 保存',
            tableShortcut: 'Enter テーブル自動補完',
            closeCurrent: '閉じる',
            closeOthers: '他を閉じる',
            closeAll: 'すべて閉じる'
        },
        fileViewer: {
            save: '保存',
            saving: '保存中...',
            preview: 'プレビュー',
            raw: 'ソース',
            theme: 'テーマ',
            export: 'エクスポート',
            print: '印刷',
            exportHtml: 'HTMLとしてエクスポート',
            exportPdf: 'PDFとしてエクスポート',
            exportDocx: 'Wordとしてエクスポート',
            empty: 'ファイルは空です',
            unsupported: 'サポートされていないファイル形式',
            themeNames: {
                default: 'デフォルト（ダーク）',
                light: 'ライトモード',
                sepia: 'セピア',
                github: 'GitHub'
            }
        },
        menuBar: {
            file: 'ファイル',
            openFolder: 'フォルダを開く...',
            refresh: '更新',
            view: '表示',
            toggleSidebar: 'サイドバーの切り替え',
            help: 'ヘルプ',
            about: '詳細'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: 'MDファイルの閲覧と編集に特化',
            confirmDelete: '{name} を削除してもよろしいですか？'
        },
        errors: {
            componentError: 'コンポーネントのレンダリングエラー',
            retry: '再試行',
            createFail: '作成失敗: {error}',
            createFolderFail: 'フォルダ作成失敗: {error}',
            loadFail: '読み込み失敗: {error}',
            renameFail: '名前変更失敗: {error}',
            pasteFail: '貼り付け失敗: {error}',
            duplicateFail: '複製失敗: {error}',
            deleteFail: '削除失敗: {error}',
            exportSuccess: '🎉 エクスポート成功: {path}',
            exportFail: 'エクスポート失敗: {error}',
            contentNotFound: 'コンテンツが見つかりません'
        }
    },
    fr: {
        toolbar: {
            openAgent: 'Ouvrir le gestionnaire d\'agents',
            toggleSidebar: 'Basculer la barre latérale',
            toggleTheme: {
                light: 'Passer en mode clair',
                dark: 'Passer en mode sombre'
            },
            openFolder: 'Ouvrir le dossier',
            settings: 'Paramètres',
            fontSize: 'Taille de la police',
            language: 'Langue'
        },
        explorer: {
            title: 'Explorateur',
            newFile: 'Nouveau fichier',
            newFolder: 'Nouveau dossier',
            refresh: 'Rafraîchir',
            openFolder: 'Ouvrir le dossier',
            filterMd: 'Markdown uniquement',
            expandAll: 'Tout développer',
            collapseAll: 'Tout réduire',
            searchPlaceholder: 'Rechercher des fichiers...',
            emptySearch: 'Aucun fichier trouvé',
            emptyFolder: 'Le dossier est vide ou illisible',
            selectFolder: 'Sélectionner un dossier',
            create: 'Créer',
            fileNamePlaceholder: 'Nom du fichier (ex: notes.md)',
            folderNamePlaceholder: 'Nom du dossier',
            loading: 'Chargement du projet...',
            error: 'Erreur de chargement',
            retry: 'Réessayer'
        },
        contextMenu: {
            rename: 'Renommer',
            copy: 'Copier le chemin',
            paste: 'Coller',
            duplicate: 'Dupliquer',
            delete: 'Supprimer'
        },
        activityBar: {
            explorer: 'Explorateur',
            search: 'Recherche'
        },
        search: {
            placeholder: 'Rechercher dans les fichiers...',
            hint: 'Appuyez sur Entrée pour rechercher',
            count: '{count} fichiers trouvés',
            searching: 'Recherche en cours...',
            noResults: 'Aucun résultat pour "{query}"',
            moreMatches: '{count} autres correspondances...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: 'Sélectionnez un fichier pour commencer',
            saveShortcut: '⌘ + S pour Enregistrer',
            tableShortcut: 'Entrée pour Auto-complétion',
            closeCurrent: 'Fermer l\'onglet',
            closeOthers: 'Fermer les autres',
            closeAll: 'Tout fermer'
        },
        fileViewer: {
            save: 'Enregistrer',
            saving: 'Enregistrement...',
            preview: 'Aperçu',
            raw: 'Code',
            theme: 'Thème',
            export: 'Exporter',
            print: 'Imprimer',
            exportHtml: 'Exporter en HTML',
            exportPdf: 'Exporter en PDF',
            exportDocx: 'Exporter en Word',
            empty: 'Le fichier est vide',
            unsupported: 'Type de fichier non supporté',
            themeNames: {
                default: 'Défaut Sombre',
                light: 'Mode Clair',
                sepia: 'Sépia',
                github: 'GitHub'
            }
        },
        menuBar: {
            file: 'Fichier',
            openFolder: 'Ouvrir le dossier...',
            refresh: 'Rafraîchir',
            view: 'Affichage',
            toggleSidebar: 'Basculer la barre latérale',
            help: 'Aide',
            about: 'À propos'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: 'Concentré sur la visualisation et l\'édition de fichiers MD',
            confirmDelete: 'Êtes-vous sûr de vouloir supprimer {name} ?'
        },
        errors: {
            componentError: 'Erreur de rendu du composant',
            retry: 'Réessayer',
            createFail: 'Échec de création : {error}',
            createFolderFail: 'Échec de création de dossier : {error}',
            loadFail: 'Échec de chargement : {error}',
            renameFail: 'Échec du renommage : {error}',
            pasteFail: 'Échec du collage : {error}',
            duplicateFail: 'Échec de la duplication : {error}',
            deleteFail: 'Échec de la suppression : {error}',
            exportSuccess: '🎉 Exporté avec succès vers : {path}',
            exportFail: 'Échec de l\'exportation : {error}',
            contentNotFound: 'Contenu introuvable'
        }
    },
    de: {
        toolbar: {
            openAgent: 'Agent Manager öffnen',
            toggleSidebar: 'Seitenleiste umschalten',
            toggleTheme: {
                light: 'In den hellen Modus wechseln',
                dark: 'In den dunklen Modus wechseln'
            },
            openFolder: 'Ordner öffnen',
            settings: 'Einstellungen',
            fontSize: 'Schriftgröße',
            language: 'Sprache'
        },
        explorer: {
            title: 'Explorer',
            newFile: 'Neue Datei',
            newFolder: 'Neuer Ordner',
            refresh: 'Aktualisieren',
            openFolder: 'Ordner öffnen',
            filterMd: 'Nur Markdown',
            expandAll: 'Alles ausklappen',
            collapseAll: 'Alles einklappen',
            searchPlaceholder: 'Dateien suchen...',
            emptySearch: 'Keine Dateien gefunden',
            emptyFolder: 'Ordner ist leer oder nicht lesbar',
            selectFolder: 'Ordner auswählen',
            create: 'Erstellen',
            fileNamePlaceholder: 'Dateiname (z.B. notes.md)',
            folderNamePlaceholder: 'Ordnername',
            loading: 'Projekt wird geladen...',
            error: 'Fehler beim Laden',
            retry: 'Wiederholen'
        },
        contextMenu: {
            rename: 'Umbenennen',
            copy: 'Pfad kopieren',
            paste: 'Einfügen',
            duplicate: 'Duplizieren',
            delete: 'Löschen'
        },
        activityBar: {
            explorer: 'Explorer',
            search: 'Suche'
        },
        search: {
            placeholder: 'In Dateien suchen...',
            hint: 'Drücken Sie Enter zum Suchen',
            count: '{count} Dateien gefunden',
            searching: 'Suchen...',
            noResults: 'Keine Ergebnisse für "{query}"',
            moreMatches: '{count} weitere Treffer...'
        },
        editor: {
            title: 'BUN MARKDOWN',
            subtitle: 'Datei auswählen um zu beginnen',
            saveShortcut: '⌘ + S zum Speichern',
            tableShortcut: 'Enter für Tabellen-Vervollständigung',
            closeCurrent: 'Schließen',
            closeOthers: 'Andere schließen',
            closeAll: 'Alle schließen'
        },
        fileViewer: {
            save: 'Speichern',
            saving: 'Speichert...',
            preview: 'Vorschau',
            raw: 'Code',
            theme: 'Thema',
            export: 'Exportieren',
            print: 'Drucken',
            exportHtml: 'Als HTML exportieren',
            exportPdf: 'Als PDF exportieren',
            exportDocx: 'Als Word exportieren',
            empty: 'Datei ist leer',
            unsupported: 'Dateityp nicht unterstützt',
            themeNames: {
                default: 'Standard Dunkel',
                light: 'Heller Modus',
                sepia: 'Sepia',
                github: 'GitHub'
            }
        },
        menuBar: {
            file: 'File',
            openFolder: 'Open Folder...',
            refresh: 'Refresh',
            view: 'View',
            toggleSidebar: 'Toggle Sidebar',
            help: 'Help',
            about: 'About'
        },
        dialogs: {
            aboutTitle: 'Bun Markdown Editor v0.1.0',
            aboutMessage: 'Focused on MD file viewing and editing',
            confirmDelete: 'Are you sure you want to delete {name}?'
        },
        errors: {
            componentError: 'Component Render Error',
            retry: 'Retry',
            createFail: 'Create failed: {error}',
            createFolderFail: 'Create folder failed: {error}',
            loadFail: 'Load failed: {error}',
            renameFail: 'Rename failed: {error}',
            pasteFail: 'Paste failed: {error}',
            duplicateFail: 'Duplicate failed: {error}',
            deleteFail: 'Delete failed: {error}',
            exportSuccess: '🎉 Successfully exported to: {path}',
            exportFail: 'Export failed: {error}',
            contentNotFound: 'Content not found'
        }
    }
};

const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en', // Default locale
    fallbackLocale: 'en',
    messages
});

export default i18n;
