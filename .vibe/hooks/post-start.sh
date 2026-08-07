#!/usr/bin/env bash
# Runs on EVERY container start (as the container user, cwd
# /workspace). Long-running dev processes live in the `services` tmux
# session; reach them from the host with `vibe attach services`.
set -euo pipefail

bash "${VIBE_PAYLOAD:-/vibe/payload}/container/svc.sh" web bun dev
