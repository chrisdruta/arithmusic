# Working inside a vibe container

You are running inside a hardened container managed by the `vibe`
engine. Import this file from the repository's root AGENTS.md (or read
it once) — it tells you what this environment can and cannot do.

## The environment

- The repository is live at `/workspace`; it is the only host path you
  can write to. Everything else you see is the container (plus the
  read-only `/vibe/*` engine mounts below).
- `/vibe/payload` (read-only) is engine tooling; `/vibe/agent-state` is
  your persistent home for logins and state — it survives rebuilds.
- Published ports bind host loopback only. There is no Docker socket,
  no sudo that gains capabilities, no host home directory.
- Project env values load only into processes started with `vibe run`
  or the agent CLI — never rely on ambient secrets in other shells.

## Changing the container (the rebuild protocol)

You cannot rebuild or reconfigure the container yourself, and you never
need a human to copy your changes — you request them:

1. Edit `.vibe/vibe.yaml` (ports, toolchains, sidecar services,
   imports) and/or `.vibe/Dockerfile` when the extension is enabled.
2. Write `.vibe/requests/<id>.json` — pick a fresh id of 1-64 chars,
   `[a-z0-9-]`, starting alphanumeric:

   ```json
   {"format": 1, "id": "add-postgres", "kind": "rebuild",
    "reason": "tests need a database",
    "summary": "add a postgres:16 sidecar named db"}
   ```

3. Tell the operator to check `vibe request list` on the host;
   `vibe request show <id>` gives them your reason/summary plus a
   trusted diff of what will actually change, and they approve or
   reject by candidate digest.
4. The decision appears at `/vibe/results/<id>.json` (read-only).
   Outcomes differ: a rejection writes the result immediately and your
   container is untouched, so polling works. An **approval replaces
   this container** — every process in it (including you) is killed
   before the result file is written, and the result is only readable
   from the replacement container. Don't wait on an approval; tell the
   operator what to resume after the rebuild. A rejected or decided id
   is spent — use a new id for another attempt.

The engine freezes your files at poll time: editing them after the
operator looked changes nothing they approved. Never write anything
else into `.vibe/requests/`.

## Lifecycle hooks and services

- `.vibe/hooks/post-create.sh` runs once per container;
  `.vibe/hooks/post-start.sh` on every start (as the container user, in
  `/workspace`, no env file). Renaming the seeded `.sample` files
  activates them.
- Long-running dev processes belong in the `services` tmux session:
  `bash "$VIBE_PAYLOAD/container/svc.sh" NAME COMMAND [ARGS…]` from a
  hook (idempotent; logs stay in the window's scrollback). The human
  reaches it with `vibe attach services`.
