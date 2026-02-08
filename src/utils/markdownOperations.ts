import { EditorView } from '@codemirror/view';

/**
 * 包裹选中文本
 * @param view CodeMirror 编辑器视图
 * @param prefix 前缀字符
 * @param suffix 后缀字符（默认与前缀相同）
 */
export function wrapSelection(view: EditorView, prefix: string, suffix?: string) {
  const actualSuffix = suffix ?? prefix;
  const selection = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(selection.from, selection.to);

  if (selectedText) {
    // 如果有选中文本，包裹它
    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: `${prefix}${selectedText}${actualSuffix}`
      },
      selection: {
        anchor: selection.from + prefix.length + selectedText.length + actualSuffix.length
      }
    });
  } else {
    // 如果没有选中文本，插入前后缀并将光标放在中间
    view.dispatch({
      changes: {
        from: selection.from,
        insert: `${prefix}${actualSuffix}`
      },
      selection: {
        anchor: selection.from + prefix.length
      }
    });
  }

  view.focus();
}

/**
 * 插入标题
 * @param view CodeMirror 编辑器视图
 * @param level 标题级别 (1-6)
 */
export function insertHeading(view: EditorView, level: number) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineText = line.text;

  // 移除现有的标题标记
  const cleanText = lineText.replace(/^#+\s*/, '');
  const prefix = '#'.repeat(level) + ' ';

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: prefix + cleanText
    },
    selection: {
      anchor: line.from + prefix.length + cleanText.length
    }
  });

  view.focus();
}

/**
 * 插入列表
 * @param view CodeMirror 编辑器视图
 * @param ordered 是否为有序列表
 */
export function insertList(view: EditorView, ordered: boolean) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineText = line.text.trim();

  let newText: string;
  if (ordered) {
    // 有序列表
    if (/^\d+\.\s/.test(lineText)) {
      // 如果已经是有序列表，移除标记
      newText = lineText.replace(/^\d+\.\s/, '');
    } else {
      // 添加有序列表标记
      newText = '1. ' + lineText;
    }
  } else {
    // 无序列表
    if (/^[-*+]\s/.test(lineText)) {
      // 如果已经是无序列表，移除标记
      newText = lineText.replace(/^[-*+]\s/, '');
    } else {
      // 添加无序列表标记
      newText = '- ' + lineText;
    }
  }

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: newText
    },
    selection: {
      anchor: line.from + newText.length
    }
  });

  view.focus();
}

/**
 * 插入表格
 * @param view CodeMirror 编辑器视图
 * @param rows 行数
 * @param cols 列数
 */
export function insertTable(view: EditorView, rows: number = 3, cols: number = 3) {
  const selection = view.state.selection.main;

  // 生成表格
  let table = '\n';

  // 表头
  table += '|' + ' Header |'.repeat(cols) + '\n';

  // 分隔行
  table += '|' + ' ------ |'.repeat(cols) + '\n';

  // 数据行
  for (let i = 0; i < rows - 1; i++) {
    table += '|' + ' Cell   |'.repeat(cols) + '\n';
  }

  table += '\n';

  view.dispatch({
    changes: {
      from: selection.from,
      insert: table
    },
    selection: {
      anchor: selection.from + table.length
    }
  });

  view.focus();
}

/**
 * 插入链接
 * @param view CodeMirror 编辑器视图
 * @param text 链接文本
 * @param url 链接地址
 */
export function insertLink(view: EditorView, text?: string, url?: string) {
  const selection = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(selection.from, selection.to);

  const linkText = text || selectedText || '链接文本';
  const linkUrl = url || 'https://';
  const markdown = `[${linkText}](${linkUrl})`;

  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: markdown
    },
    selection: {
      anchor: selection.from + markdown.length
    }
  });

  view.focus();
}

/**
 * 插入图片
 * @param view CodeMirror 编辑器视图
 * @param alt 图片描述
 * @param url 图片地址
 */
export function insertImage(view: EditorView, alt?: string, url?: string) {
  const selection = view.state.selection.main;

  const imageAlt = alt || '图片描述';
  const imageUrl = url || 'image.png';
  const markdown = `![${imageAlt}](${imageUrl})`;

  view.dispatch({
    changes: {
      from: selection.from,
      insert: markdown
    },
    selection: {
      anchor: selection.from + markdown.length
    }
  });

  view.focus();
}

/**
 * 插入代码块
 * @param view CodeMirror 编辑器视图
 * @param language 代码语言
 */
export function insertCodeBlock(view: EditorView, language: string = '') {
  const selection = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(selection.from, selection.to);

  const codeBlock = `\n\`\`\`${language}\n${selectedText || '// 代码'}\n\`\`\`\n`;

  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: codeBlock
    },
    selection: {
      anchor: selection.from + 4 + language.length + 1
    }
  });

  view.focus();
}

/**
 * 插入引用
 * @param view CodeMirror 编辑器视图
 */
export function insertQuote(view: EditorView) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineText = line.text;

  let newText: string;
  if (lineText.startsWith('> ')) {
    // 如果已经是引用，移除标记
    newText = lineText.substring(2);
  } else {
    // 添加引用标记
    newText = '> ' + lineText;
  }

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: newText
    },
    selection: {
      anchor: line.from + newText.length
    }
  });

  view.focus();
}

/**
 * 插入水平线
 * @param view CodeMirror 编辑器视图
 */
export function insertHorizontalRule(view: EditorView) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);

  view.dispatch({
    changes: {
      from: line.to,
      insert: '\n\n---\n\n'
    },
    selection: {
      anchor: line.to + 6
    }
  });

  view.focus();
}

/**
 * 插入任务列表
 * @param view CodeMirror 编辑器视图
 */
export function insertTaskList(view: EditorView) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineText = line.text;

  let newText: string;
  if (/^- \[[ x]\] /.test(lineText)) {
    // 已经是任务列表，移除标记
    newText = lineText.replace(/^- \[[ x]\] /, '');
  } else if (/^[-*+] /.test(lineText)) {
    // 是普通列表，转为任务列表
    newText = lineText.replace(/^[-*+] /, '- [ ] ');
  } else {
    // 添加任务列表标记
    newText = '- [ ] ' + lineText;
  }

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: newText
    },
    selection: {
      anchor: line.from + newText.length
    }
  });

  view.focus();
}
