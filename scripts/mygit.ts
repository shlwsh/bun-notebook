#!/usr/bin/env bun
import { spawnSync } from "bun";

async function runGit(args: string[]) {
    const proc = spawnSync(["git", ...args]);
    if (proc.exitCode !== 0) {
        console.error(`Git command failed: git ${args.join(" ")}`);
        console.error(proc.stderr.toString());
        process.exit(1);
    }
    return proc.stdout.toString().trim();
}

async function main() {
    console.log("🚀 [mygit] 正在准备提交...");

    // 1. 获取变更状态
    const status = await runGit(["status", "--short"]);
    if (!status) {
        console.log("✨ 没有待提交的变更。");
        return;
    }

    console.log("📝 检测到变更:");
    console.log(status);

    // 2. 获取提交信息
    let commitMessage = "";
    const argMessage = process.argv.slice(2).join(" ").trim();

    if (argMessage) {
        commitMessage = argMessage;
        console.log(`🤖 使用提供的 AI 小结提交...`);
    } else {
        // 只有在没提供参数时才使用文件名生成（作为最后的兜底）
        console.log("⚠️ 未提供 AI 小结参数，使用文件名生成兜底信息...");
        const lines = status.split("\n");
        const summaryList = lines.map((line: string) => {
            const flag = line.substring(0, 2).trim();
            const file = line.substring(3);
            let action = "";
            switch (flag) {
                case "M": action = "修改"; break;
                case "A": action = "新增"; break;
                case "??": action = "添加"; break;
                case "D": action = "删除"; break;
                case "R": action = "重命名"; break;
                default: action = "更新";
            }
            const name = file.split("/").pop();
            return `${action}: ${name}`;
        });
        commitMessage = `Auto-Summary: ${summaryList.slice(0, 5).join(", ")}${summaryList.length > 5 ? " 等..." : ""}`;
    }

    console.log(`💬 最终预览提交信息: \n------------------\n${commitMessage}\n------------------`);

    // 3. 执行 Git 操作
    console.log("📦 正在执行 git add .");
    await runGit(["add", "."]);

    console.log("💾 正在执行 git commit");
    await runGit(["commit", "-m", commitMessage]);

    console.log("⬆️ 正在执行 git push");
    try {
        await runGit(["push"]);
        console.log("✅ 成功提交并推送到远程仓库！");
    } catch (e) {
        console.error("❌ 推送失败，请检查远程配置。");
    }
}

main().catch(console.error);
