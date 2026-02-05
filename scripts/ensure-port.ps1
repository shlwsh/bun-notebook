<#
.SYNOPSIS
    检查并清除占用特定端口的进程。

.DESCRIPTION
    此脚本用于检测指定端口（默认为 1420）是否被占用。
    如果端口被占用，脚本将尝试强制终止相关进程，以确保后续服务能正常启动。

.PARAMETER Port
    要检查的端口号。默认为 1420。

.EXAMPLE
    .\ensure-port.ps1 -Port 1420
#>

param (
    [Parameter(HelpMessage = "请输入要清理的端口号")]
    [int]$Port = 1420
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  端口检查与清理工具 - Port: $Port" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 获取占用指定端口的 TCP 连接
try {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
} catch {
    Write-Host "[-] 无法获取网络连接信息，请检查是否有足够权限。" -ForegroundColor Red
    exit 1
}

if ($connections) {
    Write-Host "[!] 发现端口 $Port 被以下进程占用：" -ForegroundColor Yellow
    
    # 获取唯一的进程 ID
    $pids = $connections.OwningProcess | Select-Object -Unique
    
    foreach ($pid_val in $pids) {
        $process = Get-Process -Id $pid_val -ErrorAction SilentlyContinue
        if ($process) {
            $procName = $process.Name
            Write-Host "    -> 正在终止进程: $procName (PID: $pid_val)..." -NoNewline -ForegroundColor White
            try {
                Stop-Process -Id $pid_val -Force -ErrorAction Stop
                Write-Host " [成功]" -ForegroundColor Green
            } catch {
                Write-Host " [失败: $($_.Exception.Message)]" -ForegroundColor Red
            }
        } else {
            Write-Host "    -> PID $pid_val 对应的进程已不存在。" -ForegroundColor Gray
        }
    }
    
    Write-Host "[+] 端口 $Port 清理完成。" -ForegroundColor Green
} else {
    Write-Host "[+] 端口 $Port 目前处于空闲状态，无需操作。" -ForegroundColor Green
}

Write-Host "==========================================" -ForegroundColor Cyan
