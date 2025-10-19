FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install system dependencies (non-interactive)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  curl \
  wget \
  git \
  ca-certificates \
  unzip \
  fzf \
  openssl \
  xxd \
  postgresql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
  && mv /root/.bun /usr/local/bun \
  && ln -s /usr/local/bun/bin/bun /usr/local/bin/bun

# Verify installations
RUN bun --version && fzf --version && openssl version
