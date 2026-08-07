# Playwright system dependencies on top of the engine-built tools
# image (node is already baked in). The engine supplies
# VIBE_BASE_IMAGE digest-pinned. Browsers themselves install per-user —
# see hooks/post-create.sh.
ARG VIBE_BASE_IMAGE
FROM ${VIBE_BASE_IMAGE}

USER root
RUN npx --yes playwright@1 install-deps chromium \
    && rm -rf /var/lib/apt/lists/*
USER vscode
