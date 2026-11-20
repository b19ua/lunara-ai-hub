# Edge0 145B RunPod runtime image

This directory builds a CUDA 13 runtime image for Edge0 145B. Model weights are deliberately excluded from the image and must be mounted from persistent storage.

## RunPod configuration

- Mount the persistent volume at `/workspace`.
- Place the released model folder (the folder containing `model.json`) at `/workspace/Edge0-145B-q3k`.
- Expose `8000/http` for the OpenAI-compatible API.
- The container defaults to `EDGE0_MODEL_DIR=/workspace/Edge0-145B-q3k`, `EDGE0_DEVICE=cuda:0` and `EDGE0_STRATA_DIR=/opt/edge0/edge0-strata`.

Override `EDGE0_MODEL_DIR` if the model folder is mounted elsewhere. The startup script also checks a small set of common model paths.

## Startup and diagnostics

The entrypoint validates the model with `edge0-infer inspect --model <folder> --json` before starting `edge0-infer serve`. If the model folder is absent or incomplete, it keeps the container alive and logs the problem instead of exiting. This leaves the RunPod SSH gateway available for diagnosis and correction.

The server listens on port 8000. It exposes the OpenAI-compatible API at `/v1` and the health endpoint at `/health`.

Build workflow: `.github/workflows/build-edge0-image.yml`.
