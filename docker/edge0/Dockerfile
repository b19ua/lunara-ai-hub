# Edge0 145B runtime image. Model weights are mounted separately on persistent storage.
FROM nvidia/cuda:13.0.2-devel-ubuntu24.04 AS build
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake ninja-build git curl python3 python3-venv python3-pip ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /opt
RUN git clone --depth 1 https://github.com/Edge0-AI/Edge0.git edge0
WORKDIR /opt/edge0/edge0-strata
RUN mkdir -p third_party/llama.cpp && \
    curl -fsSL https://github.com/ggml-org/llama.cpp/archive/3cf03257f219afbe7334045ff7c6a06ac68c627d.tar.gz \
    | tar -xz --strip-components=1 -C third_party/llama.cpp
RUN cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_CUDA_COMPILER="$(command -v nvcc)" -DCMAKE_CUDA_ARCHITECTURES=120 \
    -DSTRATA_ENABLE_CUDA=ON -DSTRATA_GGML_DIR="$PWD/third_party/llama.cpp" \
    -DSTRATA_BUILD_TESTS=OFF && cmake --build build --target strata -j 8
RUN uv venv .venv && uv pip install --python .venv/bin/python -r requirements.txt
WORKDIR /opt/edge0/edge0-infer
RUN cmake --preset cpu && cmake --build --preset cpu -j 8

FROM nvidia/cuda:13.0.2-runtime-ubuntu24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 libstdc++6 python3 ca-certificates findutils coreutils \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /opt/edge0 /opt/edge0
COPY --chmod=755 entrypoint.sh /usr/local/bin/edge0-entrypoint
WORKDIR /opt/edge0/edge0-infer
ENV PATH="/opt/edge0/edge0-infer/build/cpu/bin:${PATH}" \
    EDGE0_STRATA_DIR="/opt/edge0/edge0-strata" \
    EDGE0_MODEL_DIR="/workspace/Edge0-145B-q3k"
EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/edge0-entrypoint"]
