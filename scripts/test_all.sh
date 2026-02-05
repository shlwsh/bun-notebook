#!/bin/bash
set -e

echo "Running Rust tests..."
cd src-tauri
# Check formatting
cargo fmt -- --check
# Check linting
cargo clippy -- -D warnings
# Run core tests
cargo test
cd ..

echo "Running Frontend tests..."
# Run vitest
pnpm test run

echo "All tests passed!"
