#!/usr/bin/env bash
# Runs ONCE per container (as the container user, cwd /workspace) when
# `vibe up` creates it. A nonzero exit fails `vibe up`.
set -euo pipefail

bun install

# Playwright browsers land under the user home, not the image; keep the
# major in lockstep with .vibe/Dockerfile's install-deps line.
npx --yes playwright@1 install chromium
