#!/usr/bin/env bash
set -uo pipefail

INFER="/opt/edge0/edge0-infer/build/cpu/bin/edge0-infer"
export EDGE0_STRATA_DIR="${EDGE0_STRATA_DIR:-/opt/edge0/edge0-strata}"
MODEL_DIR="${EDGE0_MODEL_DIR:-/workspace/Edge0-145B-q3k}"
DEVICE="${EDGE0_DEVICE:-cuda:0}"

log() { printf '[edge0-entrypoint] %s\n' "$*" >&2; }

if [[ ! -x "$INFER" ]]; then
  log "FATAL: edge0-infer executable not found: $INFER"
  log "Keeping container alive for diagnostics."
  exec sleep infinity
fi

if [[ ! -x "$EDGE0_STRATA_DIR/build/strata" ]]; then
  log "FATAL: edge0-strata engine not found: $EDGE0_STRATA_DIR/build/strata"
  log "Keeping container alive for diagnostics."
  exec sleep infinity
fi

while true; do
  if [[ ! -f "$MODEL_DIR/model.json" ]]; then
    for candidate in \
      /workspace/Edge0-145B-q3k \
      /workspace/models/Edge0-145B-q3k \
      /models/Edge0-145B-q3k \
      /workspace/Edge0-145B-NVFP4 \
      /models/Edge0-145B-NVFP4; do
      if [[ -f "$candidate/model.json" ]]; then
        MODEL_DIR="$candidate"
        break
      fi
    done
  fi

  if [[ ! -f "$MODEL_DIR/model.json" ]]; then
    log "Model folder not found at $MODEL_DIR; checking mounted volumes."
    for root in /workspace /models; do
      if [[ -d "$root" ]]; then
        find "$root" -maxdepth 3 -type f -name model.json -print 2>/dev/null | head -n 10 >&2
      fi
    done
    log "Container remains available for SSH diagnostics. Set EDGE0_MODEL_DIR or mount the model under /workspace/Edge0-145B-q3k."
    sleep 20
    continue
  fi

  log "Checking model assets in $MODEL_DIR"
  if "$INFER" inspect --model "$MODEL_DIR" --json; then
    log "Model assets passed inspection. Starting Edge0 server on port 8000 (device $DEVICE)."
    "$INFER" serve --model "$MODEL_DIR" --device "$DEVICE"
    status=$?
    log "edge0-infer exited with status $status; retrying in 20 seconds."
    sleep 20
  else
    log "Model asset inspection failed. Container remains available; will retry in 60 seconds."
    sleep 60
  fi
done
