# Redneck Heavy Industries

Static prototype documentation site and store for **Redneck Heavy Industries** — custom tactical solutions (networking, tech, clothing) with a good-enough philosophy.

Built with **Next.js** (static export), **MDX**, **shadcn/ui**, and **Tailwind CSS**.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Static build

```bash
npm run build
```

Output lands in `docs/`. Preview locally with any static server, e.g. `npx serve docs`.

For a project-pages base path locally:

```bash
BASE_PATH=/rhi-website npm run build
```

## Docker build

Build with the official Node image (no custom Dockerfile). Source is mounted in; export writes to `docs/` in the project:

```bash
./scripts/docker-build.sh
```

Optional project-pages base path:

```bash
BASE_PATH=/rhi-website ./scripts/docker-build.sh
```

Publish somewhere other than `docs/` after the build:

```bash
OUT_DIR=/tmp/rhi-site ./scripts/docker-build.sh
```

This runs `node:22-bookworm-slim` with:

- project root → `/app`
- anonymous volume for `/app/node_modules` (Linux deps, not the host’s)

Override the image with `NODE_IMAGE=node:22 ./scripts/docker-build.sh` if needed.

## Content

Products live under `content/products/<slug>/`:

- `meta.json` — name, tags, SKU, accents, summary, optional `images[]`, optional `docsAvailable`, optional `buyUrl`
- `overview.mdx` — optional long-form overview (not shown in UI currently)
- `docs.mdx` — technical / build documentation shown on the product detail page (headings become the TOC)

Blog posts live under `content/blog/<slug>/`:

- `meta.json` — title, excerpt, tags, `publishedAt`, author, optional `coverImage`, optional `draft`
- `post.mdx` — entry body (headings become the TOC on the post page)

Tags: `Clothing`, `Software`, `AI`, `Tools`, `Pouches`.

Blog tags: `Field`, `Build`, `Networking`, `Software`, `AI`.

- Set `"docsAvailable": false` to hide the docs body on the product page.
- Set `"buyUrl": "https://…"` for the Buy button; omit or leave empty to keep Buy locked/greyed out.

### SKU format

`RHI-<SPECIMEN>-<L><T><I><G>` — e.g. `RHI-SPECIMEN-A000`

- `SPECIMEN` — short product code
- `L` — category letter: `C` Clothing, `S` Software, `A` AI, `T` Tools, `P` Pouches
- `T` / `I` / `G` — single digits for specific product type, product id, and generation

Optional `images` are public paths (e.g. `/products/slug/01.svg`). Two or more images enable an auto-sliding gallery on the product detail page.

## Routes

| Path | Description |
|------|-------------|
| `/` | Brand landing |
| `/store/` | Shop (search, tags, list/grid); `?tag=Pouches` filters |
| `/store/<slug>/` | Product detail, in-page docs + TOC, Buy via `buyUrl` |
| `/blog/` | Field notes index (search, tags); `?tag=Field` filters |
| `/blog/<slug>/` | Blog entry with MDX body + TOC |

Deploy by publishing the `docs/` directory from `./scripts/docker-build.sh` (or `npm run build`) to any static host.
