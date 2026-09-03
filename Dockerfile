# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Slivadoc Partners — Next.js 16 App Router, SSR, self-hosted on the Slivadoc VM
#
# RESTORED 2026-09-03. Commit f249a39 ("Make partners app Vercel-native") deleted
# this file, .dockerignore and a 247-line publish workflow. Nothing rebuilt the
# image afterwards, but partners.slivadoc.com still resolves to the VM and Caddy
# still serves it from this container — so the public site sat frozen on the
# 2026-08-30 image while main moved 15 commits ahead, including a form-crash fix,
# the multilingual work, the SEO/keyword expansion, the brand assets, and the
# api.slivadoc.com proxy default. This brings the build back onto our stack.
#
# Build:  docker build --platform=linux/amd64 -t ghcr.io/s-v2/slivadoc-partners:latest .
# Run:    docker run --rm -p 3000:3000 ghcr.io/s-v2/slivadoc-partners:latest
#
# ---------------------------------------------------------------------------
# WHY THIS SHAPE — each point verified against this repo, not assumed
# ---------------------------------------------------------------------------
# 1. BOTH STAGES ARE ALPINE, and that is load-bearing. app/partner-portal.tsx
#    renders two <Image> logos without `unoptimized` (the hero image does set
#    it), so /_next/image runs Next's optimizer, which requires sharp. sharp 0.34
#    ships its binary as a real platform dependency — package-lock.json already
#    resolves @img/sharp-linuxmusl-x64 — and `next build` TRACES that binary into
#    .next/standalone/node_modules. Whichever libc the BUILD stage uses is
#    therefore the libc baked into the runtime bundle. The deleted Dockerfile
#    built on 22-bookworm-slim and ran on 22-alpine; that mismatch was harmless
#    for the old vinext app, which had no sharp, and would now ship glibc
#    binaries into a musl runtime and fail on the first optimized image.
#
# 2. Node 22, not 24. package.json pins `engines.node: "22.x"` and
#    .github/workflows/ci.yml runs node-version 22. slivadoc-frontend is on
#    node:24-alpine; do not copy that here without moving the engines pin first.
#
# 3. `output: "standalone"` in next.config.ts is required by the runtime stage
#    below, which copies .next/standalone. Without it that directory does not
#    exist and the build fails loudly rather than shipping a broken image.
#
# 4. `npm ci --ignore-scripts` is safe. The only dependency here whose native
#    payload matters is sharp, and sharp 0.33+ delivers it as prebuilt @img/*
#    packages rather than through an install script, so nothing needed at
#    runtime is skipped. package.json's `allowScripts` block is a leftover of
#    the Vercel toolchain and has no effect on npm.
#
# 5. NODE_ENV is deliberately NOT production for `npm ci`: next, typescript,
#    tailwind and the eslint config are all devDependencies, and the build
#    cannot run without them.
# ---------------------------------------------------------------------------
ARG NODE_IMAGE=22-alpine

FROM node:${NODE_IMAGE} AS dependencies
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund --ignore-scripts

FROM node:${NODE_IMAGE} AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# The one build-time-inlined value in this app. app/google-analytics.tsx reads
# NEXT_PUBLIC_GA_MEASUREMENT_ID, validates it against /^G-[A-Z0-9]+$/ and falls
# back to the hardcoded G-1HBZTWHBPN stream when it is absent or malformed, so an
# unset build arg degrades to the official stream rather than breaking analytics.
# It is still declared here so a future environment can point at its own stream
# without editing source — and unset when empty so the in-code default wins
# instead of an empty string reaching the validator.
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
RUN set -eu; \
    [ -n "${NEXT_PUBLIC_GA_MEASUREMENT_ID:-}" ] || unset NEXT_PUBLIC_GA_MEASUREMENT_ID; \
    npm run build

FROM node:${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
ENV PORT=3000
# Next's standalone server binds process.env.HOSTNAME. Left unset it resolves to
# the container hostname, which listens on the wrong interface and makes the
# service unreachable from Caddy on the `edge` network.
ENV HOSTNAME=0.0.0.0
# Node's bundled ICU resolves Asia/Jakarta, but musl reads zones from
# /usr/share/zoneinfo, which Alpine ships empty. Without tzdata the shell and
# every libc-formatted log line stay on UTC while the app reports WIB.
ENV TZ=Asia/Jakarta
RUN apk add --no-cache tzdata \
    && addgroup --system --gid 10001 slivadoc \
    && adduser --system --uid 10001 --ingroup slivadoc slivadoc
WORKDIR /app
COPY --from=build --chown=10001:10001 /app/public ./public
COPY --from=build --chown=10001:10001 /app/.next/standalone ./
COPY --from=build --chown=10001:10001 /app/.next/static ./.next/static
USER 10001
EXPOSE 3000
# Probes "/", the partner landing page. It exercises the standalone server and
# its build artefacts and touches no upstream: the Slivadoc API is only reached
# from /api/partner-applications, so a backend outage must not mark this
# container unhealthy for a failure it does not own.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
# No tini and no init: true. Next.js standalone installs its own SIGTERM handler,
# so PID 1 already has a signal disposition and an init shim would add a process
# for nothing.
CMD ["node", "server.js"]
