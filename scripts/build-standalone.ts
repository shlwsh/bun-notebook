import { $ } from "bun";
import { join } from "node:path";
import { rm, mkdir } from "node:fs/promises";

/**
 * 构建独立可执行文件
 * 
 * 变更说明：
 * - WASM 文件现在通过 `import with { type: "file" }` 自动嵌入到可执行文件中
 * - 移除了手动拷贝 WASM 文件的步骤
 * - 前端资源仍需外部分发（可选：未来可使用 Bun 的 full-stack 模式嵌入）
 */
async function build() {
    const rootDir = process.cwd();
    const frontendDir = join(rootDir, "frontend");
    const backendDir = join(rootDir, "backend");
    const distDir = join(rootDir, "dist");
    const distPublicDir = join(distDir, "public");

    console.log("🚀 Starting Standalone Build (Embedded WASM Mode)...\n");

    // 1. 清理环境
    console.log("🧹 Cleaning up old builds...");
    await rm(distDir, { recursive: true, force: true });
    await mkdir(distDir, { recursive: true });
    await mkdir(distPublicDir, { recursive: true });

    // 2. 构建前端
    console.log("📦 Building Frontend...");
    await $`cd ${frontendDir} && bun run build`.text();

    // 3. 拷贝前端产物
    console.log("🚚 Copying frontend assets...");
    await $`cp -r ${frontendDir}/dist/* ${distPublicDir}/`.text();

    // 4. 编译后端二进制（WASM 文件通过 import 自动嵌入）
    console.log("🛠️ Compiling standalone binary with embedded WASM...");
    const entryPoint = join(backendDir, "src", "index.ts");
    const outFile = join(distDir, "codeview-app");

    await $`bun build --compile --minify --outfile ${outFile} ${entryPoint}`.text();

    console.log("\n" + "=".repeat(50));
    console.log("✅ Standalone Build Complete!");
    console.log("=".repeat(50));
    console.log("\n📁 Output Directory: dist/");
    console.log("🎯 Executable: dist/codeview-app");
    console.log("📂 Frontend Assets: dist/public/");
    console.log("\n💡 Run with: cd dist && ./codeview-app");
    console.log("\n📝 Note: WASM files are now embedded in the binary!");
}

build().catch(console.error);
