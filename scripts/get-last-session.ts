#!/usr/bin/env bun
import { readdirSync, lstatSync } from "fs";
import { join } from "path";

const sessionsDir = join(process.cwd(), "sessions");

try {
    if (!readdirSync(process.cwd()).includes("sessions")) {
        console.error("❌ 错误: 未找到 sessions 目录。");
        process.exit(1);
    }

    const files = readdirSync(sessionsDir)
        .filter(f => f.startsWith("session_") && f.endsWith(".md"))
        .map(f => ({
            name: f,
            path: join(sessionsDir, f),
            time: lstatSync(join(sessionsDir, f)).mtime.getTime()
        }));

    if (files.length === 0) {
        console.log("Empty");
        process.exit(0);
    }

    // Sort by modified time descending
    files.sort((a, b) => b.time - a.time);

    const lastSession = files[0];
    console.log(lastSession.path);
} catch (e: any) {
    console.error(`❌ 获取失败: ${e.message}`);
    process.exit(1);
}
