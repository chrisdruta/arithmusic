# Playwright on top of the engine-built tools image, driven by the
# baked-in bun (no node toolchain needed). Browsers + system deps land
# in the image at /ms-playwright; keep the playwright version pinned in
# lockstep with package.json.
ARG VIBE_BASE_IMAGE
FROM ${VIBE_BASE_IMAGE}

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
USER root
RUN /home/vscode/.bun/bin/bunx playwright@1.62.1 install --with-deps chromium \
    && chmod -R a+rX /ms-playwright \
    && rm -rf /var/lib/apt/lists/* /root/.bun /root/.cache
USER vscode
