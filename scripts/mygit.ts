#!/usr/bin/env bun
import { spawnSync } from "bun";

interface GitResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
}

/**
 * 执行 Git 命令
 * @param args Git 命令参数
 * @param throwOnError 是否在错误时抛出异常
 */
function runGit(args: string[], throwOnError = true): GitResult {
    const proc = spawnSync(["git", ...args]);
    const result: GitResult = {
        success: proc.exitCode === 0,
        stdout: proc.stdout.toString().trim(),
        stderr: proc.stderr.toString().trim(),
        exitCode: proc.exitCode || 0,
    };

    if (!result.success && throwOnError) {
        console.error(`❌ Git 命令失败: git ${args.join(" ")}`);
        console.error(result.stderr);
        process.exit(1);
    }

    return result;
}

/**
 * 获取当前分支名
 */
function getCurrentBranch(): string {
    const result = runGit(["branch", "--show-current"]);
    return result.stdout;
}

/**
 * 使用 AI 生成提交信息
 */
async function generateAICommitMessage(status: string): Promise<string | null> {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const baseUrl = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
    const model = process.env.DASHSCOPE_MODEL || "deepseek-v3";

    if (!apiKey) {
        console.log("⚠️ 未配置 DASHSCOPE_API_KEY，跳过 AI 生成");
        return null;
    }

    console.log("🤖 正在使用 AI 生成提交信息...");

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: "你是一个 Git 提交信息生成助手。根据 git status 的输出，生成简洁、清晰的中文提交信息。提交信息应该：1) 不超过 50 个字符；2) 使用动词开头；3) 概括主要变更。只返回提交信息本身，不要有其他说明。"
                    },
                    {
                        role: "user",
                        content: `请根据以下 git status 输出生成提交信息：\n\n${status}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 100,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`❌ AI API 请求失败: ${response.status} ${response.statusText}`);
            console.error(error);
            return null;
        }

        const data = await response.json();
        const message = data.choices?.[0]?.message?.content?.trim();
        
        if (message) {
            console.log(`✨ AI 生成的提交信息: ${message}`);
            return message;
        }

        return null;
    } catch (error) {
        console.error("❌ AI 生成失败:", error);
        return null;
    }
}

/**
 * 生成兜底提交信息
 */
function generateFallbackMessage(status: string): string {
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
    return `Auto-Summary: ${summaryList.slice(0, 5).join(", ")}${summaryList.length > 5 ? " 等..." : ""}`;
}

async function main() {
    console.log("🚀 [mygit] 正在准备提交...");

    // 1. 获取变更状态
    const statusResult = runGit(["status", "--short"]);
    const status = statusResult.stdout;
    
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
        // 用户手动提供了提交信息
        commitMessage = argMessage;
        console.log(`💬 使用手动提供的提交信息`);
    } else {
        // 尝试使用 AI 生成
        const aiMessage = await generateAICommitMessage(status);
        
        if (aiMessage) {
            commitMessage = aiMessage;
        } else {
            // AI 生成失败，使用兜底方案
            console.log("⚠️ AI 生成失败，使用文件名生成兜底信息...");
            commitMessage = generateFallbackMessage(status);
        }
    }

    console.log(`\n💬 最终提交信息:\n------------------\n${commitMessage}\n------------------\n`);

    // 3. 执行 Git 操作
    console.log("📦 正在执行 git add .");
    runGit(["add", "."]);

    console.log("💾 正在执行 git commit");
    runGit(["commit", "-m", commitMessage]);

    // 4. 推送到远程
    console.log("⬆️ 正在执行 git push");
    const pushResult = runGit(["push"], false);

    if (!pushResult.success) {
        // 检查是否是因为没有上游分支
        if (pushResult.stderr.includes("没有对应的上游分支") || 
            pushResult.stderr.includes("no upstream branch")) {
            const branch = getCurrentBranch();
            console.log(`🔧 检测到分支 '${branch}' 没有上游分支，正在设置...`);
            
            const setUpstreamResult = runGit(["push", "--set-upstream", "origin", branch], false);
            
            if (setUpstreamResult.success) {
                console.log("✅ 成功设置上游分支并推送到远程仓库！");
            } else {
                console.error("❌ 设置上游分支失败");
                console.error(setUpstreamResult.stderr);
                process.exit(1);
            }
        } else {
            console.error("❌ 推送失败");
            console.error(pushResult.stderr);
            process.exit(1);
        }
    } else {
        console.log("✅ 成功提交并推送到远程仓库！");
    }
}

main().catch(console.error);
