export interface Range {
    start_line: number;
    start_col: number;
    end_line: number;
    end_col: number;
}

export enum SymbolKind {
    File = "File",
    Module = "Module",
    Namespace = "Namespace",
    Package = "Package",
    Class = "Class",
    Method = "Method",
    Property = "Property",
    Field = "Field",
    Constructor = "Constructor",
    Enum = "Enum",
    Interface = "Interface",
    Function = "Function",
    Variable = "Variable",
    Constant = "Constant",
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    Array = "Array",
    Object = "Object",
    Key = "Key",
    Null = "Null",
    EnumMember = "EnumMember",
    Struct = "Struct",
    Event = "Event",
    Operator = "Operator",
    TypeParameter = "TypeParameter",
}

export interface Symbol {
    name: string;
    kind: SymbolKind;
    range: Range;
    detail?: string | null;
    children: Symbol[];
}

export interface Import {
    source: string;
    resolved_path: string | null;
    range: Range;
    is_dynamic: boolean;
}

export interface FileAnalysisResult {
    path: string;
    symbols: Symbol[];
    imports: Import[];
    error?: string | null;
}

export interface SerializableGraph {
    nodes: string[];
    edges: [string, string][];
}

export interface CommitInfo {
    hash: string;
    author_name: string;
    date: string;
    message: string;
}

export interface ProjectStats {
    totalFiles: number;
    totalSymbols: number;
    languages: Record<string, number>;
}

export enum Severity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error",
}

export interface GovernanceIssue {
    rule_id: string;
    title: string;
    description: string;
    severity: Severity;
    affected_files: string[];
}

export interface ProjectHealth {
    score: number;
    issue_count: number;
    hot_files: string[];
    complex_files: string[];
}
