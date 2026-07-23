# WeChat Avatar Scientific Insight Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and verify a production-ready 1024 × 1024 WeChat avatar Logo that implements the approved “Scientific Insight Core” design.

**Architecture:** Use the built-in image-generation tool to create one centered, text-free master raster asset from the approved design specification. Save the selected result under `assets/branding/`, derive a circular-crop preview locally with Pillow, and validate the master at full, 256-pixel, and 64-pixel sizes.

**Tech Stack:** Built-in `image_gen`, PNG, Pillow 11.3, macOS `sips`, local visual inspection.

---

### Task 1: Generate and select the master Logo

**Files:**
- Reference: `docs/superpowers/specs/2026-07-23-wechat-avatar-scientific-insight-core-design.md`
- Create: `assets/branding/scientific-insight-core-wechat.png`

- [ ] **Step 1: Create the destination directory**

Run:

```bash
mkdir -p assets/branding
```

Expected: `assets/branding/` exists without modifying existing assets.

- [ ] **Step 2: Generate the Logo with the built-in image tool**

Use one built-in `image_gen` call with this complete prompt:

```text
Use case: logo-brand
Asset type: personal WeChat avatar, square master image
Primary request: Create a compact “Scientific Insight Core” emblem matching the visual language of an AI for Science research website.
Scene/backdrop: a complete deep navy #061f45 background designed to become a clean circular avatar when WeChat crops the square image
Subject: one bright cyan-blue insight core at the exact center; four equally important round nodes orbiting it, representing scientific data modeling, scientific literature mining, scientific inference, and Science of AI; two bold continuous orbital strokes connect the system; the lower negative space subtly reads as a simple open book, while the upper-right orbital motion forms a clear rising discovery path
Style/medium: modern restrained flat vector-style logo, geometric, minimal, high contrast, crisp edges, professional scientific identity
Composition/framing: 1:1 square, centered, near-symmetrical, all meaningful elements inside the central 70% circular safe area; the rising path may lean slightly toward the upper right; thick strokes and large nodes that remain readable at 64 × 64 pixels
Lighting/mood: calm, intelligent, precise; only the central core may have a very subtle soft glow
Color palette: deep navy #061f45, primary blue #0b5fc6, cyan #59b7ef, white; no other dominant colors
Constraints: exactly one central core and exactly four surrounding nodes; no text, letters, numbers, Chinese characters, acronyms, university seal, watermark, border, mockup frame, or external brand mark; the first visual focus must be the core, the second the four-node orbit, and the third the book and upward-path meanings
Avoid: black-red palette, detailed grids, tiny data lines, stars, space scene, people, robots, light bulbs, microscopes, photorealism, 3D metal, glass, strong neon, heavy shadows, lens flare, decorative micro-dots, excessive gradients, visual clutter
```

Expected: one square Logo with a centered core, exactly four legible nodes, and no generated text.

- [ ] **Step 3: Inspect the generated result**

Open the generated image with the local image viewer and verify:

- the central core is the first focal point;
- exactly four surrounding nodes are visible;
- the lower negative space suggests an open book without becoming a literal illustration;
- the upper-right path reads as upward movement;
- there is no text, watermark, extra symbol, black-red palette, or small decorative clutter.

Expected: all five checks pass. If one check fails, perform one targeted regeneration that changes only the failed property while preserving the rest of the prompt.

- [ ] **Step 4: Save the selected image**

Set `SCIENTIFIC_INSIGHT_GENERATED_PATH` to the absolute PNG path reported by the built-in image tool, then copy that exact file. Do not search for a “latest” file or infer the path:

```bash
cp "$SCIENTIFIC_INSIGHT_GENERATED_PATH" assets/branding/scientific-insight-core-wechat.png
```

Expected: `assets/branding/scientific-insight-core-wechat.png` is a readable PNG in the workspace.

- [ ] **Step 5: Normalize the master to 1024 × 1024**

The built-in generator may return a larger square PNG. Resize the copied workspace asset in place:

```bash
sips -z 1024 1024 assets/branding/scientific-insight-core-wechat.png
```

Expected: the workspace master is exactly 1024 × 1024 while the original generated file remains unchanged.

### Task 2: Produce the circular-crop preview and size samples

**Files:**
- Read: `assets/branding/scientific-insight-core-wechat.png`
- Create: `assets/branding/scientific-insight-core-wechat-circle-preview.png`
- Create temporarily: `/tmp/scientific-insight-core-wechat-256.png`
- Create temporarily: `/tmp/scientific-insight-core-wechat-64.png`

- [ ] **Step 1: Create the circular preview**

Run:

```bash
python3 -c 'from PIL import Image, ImageDraw; import sys; src, dst = sys.argv[1:3]; im = Image.open(src).convert("RGBA"); w, h = im.size; mask = Image.new("L", (w, h), 0); ImageDraw.Draw(mask).ellipse((0, 0, w - 1, h - 1), fill=255); im.putalpha(mask); im.save(dst)' assets/branding/scientific-insight-core-wechat.png assets/branding/scientific-insight-core-wechat-circle-preview.png
```

Expected: the preview has transparent corners and preserves the complete avatar inside the circle.

- [ ] **Step 2: Create 256-pixel and 64-pixel samples**

Run:

```bash
sips -z 256 256 assets/branding/scientific-insight-core-wechat.png --out /tmp/scientific-insight-core-wechat-256.png
sips -z 64 64 assets/branding/scientific-insight-core-wechat.png --out /tmp/scientific-insight-core-wechat-64.png
```

Expected: both temporary PNG files are created at exactly the requested dimensions.

### Task 3: Validate and commit the deliverables

**Files:**
- Verify: `assets/branding/scientific-insight-core-wechat.png`
- Verify: `assets/branding/scientific-insight-core-wechat-circle-preview.png`
- Verify temporarily: `/tmp/scientific-insight-core-wechat-256.png`
- Verify temporarily: `/tmp/scientific-insight-core-wechat-64.png`

- [ ] **Step 1: Verify dimensions, format, and circular alpha**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g format -g hasAlpha assets/branding/scientific-insight-core-wechat.png
sips -g pixelWidth -g pixelHeight -g format -g hasAlpha assets/branding/scientific-insight-core-wechat-circle-preview.png
python3 -c 'from PIL import Image; import sys; master = Image.open(sys.argv[1]); preview = Image.open(sys.argv[2]).convert("RGBA"); assert master.size == (1024, 1024), master.size; assert preview.size == (1024, 1024), preview.size; assert all(preview.getpixel(p)[3] == 0 for p in [(0, 0), (1023, 0), (0, 1023), (1023, 1023)]); assert preview.getpixel((512, 512))[3] == 255; print("PASS: dimensions and circular alpha")' assets/branding/scientific-insight-core-wechat.png assets/branding/scientific-insight-core-wechat-circle-preview.png
```

Expected: both images are 1024 × 1024 PNG files and the Python check prints `PASS: dimensions and circular alpha`.

- [ ] **Step 2: Perform visual checks at three sizes**

Inspect the master, circular preview, 256-pixel sample, and 64-pixel sample. Confirm that the core remains dominant, all four nodes remain separable, the orbit remains continuous, and no critical element touches the circular crop boundary.

Expected: all composition requirements remain legible at 64 × 64 pixels.

- [ ] **Step 3: Check repository scope**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only the implementation plan and the two intended PNG deliverables are new or modified, while `docs/AI_for_Science_科研智能演进框架.md` remains untouched and untracked.

- [ ] **Step 4: Commit the generated assets**

Run:

```bash
git add docs/superpowers/plans/2026-07-23-wechat-avatar-scientific-insight-core.md assets/branding/scientific-insight-core-wechat.png assets/branding/scientific-insight-core-wechat-circle-preview.png
git commit -m "feat: add scientific insight core avatar"
```

Expected: one commit containing the implementation plan and the two verified avatar files.
