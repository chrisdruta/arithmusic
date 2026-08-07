#!/usr/bin/env bash
# Runs ONCE per container (as the container user, cwd /workspace) when
# `vibe up` creates it. A nonzero exit fails `vibe up`.
set -euo pipefail

bun install
