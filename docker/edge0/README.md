# Edge0 145B runtime image

This directory builds a CUDA 13 runtime image for Edge0 145B Q3_K. The model weights are deliberately excluded from the image and should be mounted at `/models/Edge0-145B-q3k` on a persistent RunPod volume.

Build workflow: `.github/workflows/build-edge0-image.yml`.
