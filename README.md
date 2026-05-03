# Srikant Singh — Portfolio

A static portfolio site built with plain HTML, CSS, and vanilla JavaScript. No build step, no framework — content is written in Markdown and registered in JSON index files.

---

## Running locally

Requires Python 3 (included with macOS and most Linux distros).

```bash
cd Portfolio
python3 serve.py
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The server disables caching so every refresh picks up your latest changes immediately.

---

## Project structure

```
Portfolio/
├── index.html              # Home page
├── projects.html           # Projects listing
├── research.html           # Research & Articles listing (combined)
├── about.html              # About & Contact
├── post.html               # Shared detail page (projects, research, articles)
├── serve.py                # Local dev server
│
├── assets/
│   ├── css/style.css       # All styles (single file, design tokens at top)
│   ├── js/
│   │   ├── sidebar.js      # Sidebar HTML + injection
│   │   └── main.js         # Nav, markdown loading, TOC, page loaders
│   └── images/             # SVG illustrations for project cards
│
└── content/
    ├── data/
    │   ├── projects.json   # Project index (drives cards + home page preview)
    │   ├── research.json   # Research index (drives listing + home page preview)
    │   └── articles.json   # Articles index (drives listing + home page preview)
    ├── projects/           # One .md file per project
    ├── research/           # One .md file per paper
    └── articles/           # One .md file per article
```

---

## Adding a new Project

### Step 1 — Add an entry to `content/data/projects.json`

Open [content/data/projects.json](content/data/projects.json) and append a new object to the array:

```json
{
  "title": "Your Project Title",
  "excerpt": "One or two sentence description shown on the card.",
  "date": "May 2025",
  "stack": ["Python", "Django", "PostgreSQL"],
  "status": "Production",
  "image": "assets/images/your-image.svg",
  "file": "content/projects/your-project.md",
  "github": "https://github.com/you/repo"
}
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `title` | yes | Displayed as the card heading |
| `excerpt` | yes | Short description on the card (2–3 sentences max) |
| `date` | yes | Display date, e.g. `"May 2025"` |
| `stack` | yes | Array of tech tags shown on the card (first 4 are shown) |
| `status` | no | `"Production"` shows a green badge; omit otherwise |
| `image` | no | Path to an SVG/image for the card thumbnail |
| `file` | yes | Path to the Markdown detail file (see Step 2) |
| `github` | no | GitHub repo URL, shown as a button on the detail page |

The home page automatically shows the first 3 entries in the array, so put your newest projects at the top.

### Step 2 — Create `content/projects/your-project.md`

Create a new Markdown file in [content/projects/](content/projects/). The front-matter keys must match the JSON entry:

```markdown
---
title: Your Project Title
date: May 2025
github: https://github.com/you/repo
status: Production
tags: [Python, Django, PostgreSQL, Docker]
---

## Overview

Write a detailed description of what the project does and why you built it.

## Architecture

Describe how it's structured, key design decisions, etc.

## Results

Any metrics, performance numbers, or outcomes worth highlighting.
```

**Front-matter fields:**

| Field | Description |
|---|---|
| `title` | Page title (should match the JSON entry) |
| `date` | Date string |
| `github` | Repo URL — renders as a "GitHub ↗" button |
| `status` | e.g. `Production` — shown in the meta bar |
| `tags` | Array of tech tags displayed at the bottom of the page |

---

## Adding a new Research paper

### Step 1 — Add an entry to `content/data/research.json`

Open [content/data/research.json](content/data/research.json) and append:

```json
{
  "title": "Your Paper Title",
  "venue": "Conference or Journal Name",
  "date": "2025-05-01",
  "status": "published",
  "abstract": "One-paragraph abstract shown on the listing page.",
  "tags": ["NLP", "Transformers"],
  "file": "content/research/your-paper.md",
  "paper_url": "https://arxiv.org/abs/xxxx.xxxxx",
  "code_url": "https://github.com/you/repo"
}
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `title` | yes | Full paper title |
| `venue` | yes | Conference, journal, or "Under Review — Venue Name" |
| `date` | yes | ISO date `"YYYY-MM-DD"` — used for ordering |
| `status` | yes | `"published"`, `"review"`, or `"preprint"` — controls badge colour |
| `abstract` | yes | Short abstract for the listing card (3–4 sentences) |
| `tags` | no | Keyword tags |
| `file` | yes | Path to the Markdown detail file |
| `paper_url` | no | Link to PDF/arXiv; use `"#"` if not yet public |
| `code_url` | no | Link to code repository |

**Status badge colours:**
- `published` → green
- `review` → amber
- `preprint` → blue

The home page automatically shows the first 2 entries, so put your newest paper at the top.

### Step 2 — Create `content/research/your-paper.md`

```markdown
---
title: Your Paper Title
date: 2025-05-01
venue: Conference or Journal Name
status: published
tags: [NLP, Transformers, Low-Resource]
paper_url: https://arxiv.org/abs/xxxx.xxxxx
code_url: https://github.com/you/repo
---

## Abstract

Full abstract text here.

## Introduction

Background and motivation.

## Method

Technical approach. You can use LaTeX math inline with `$...$` or display blocks with `$$...$$`.

$$
\mathcal{L} = -\sum_{i} y_i \log \hat{y}_i
$$

## Results

| Dataset | F1 | Precision | Recall |
|---|---|---|---|
| Hindi | 87.4 | 85.2 | 89.7 |
| Bengali | 83.1 | 81.4 | 84.9 |

## Conclusion

Summary of contributions and future work.
```

---

## Adding a new Article

### Step 1 — Add an entry to `content/data/articles.json`

Open [content/data/articles.json](content/data/articles.json) and append:

```json
{
  "title": "Your Article Title",
  "excerpt": "One or two sentence hook shown on the listing.",
  "date": "2025-05-01",
  "tags": ["Python", "System Design"],
  "file": "content/articles/your-article.md"
}
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `title` | yes | Article title |
| `excerpt` | yes | Short teaser shown on the listing card |
| `date` | yes | ISO date `"YYYY-MM-DD"` — the day and month are displayed on the card |
| `tags` | no | Keyword tags |
| `file` | yes | Path to the Markdown detail file |

The home page shows the first 3 articles, so put the newest at the top.

### Step 2 — Create `content/articles/your-article.md`

```markdown
---
title: Your Article Title
date: 2025-05-01
tags: [Python, System Design, Backend]
---

Your article body here. Standard Markdown is supported — headings,
lists, code blocks, tables, and inline `code`.

## Section Heading

Content…

```python
def example():
    return "syntax highlighting works out of the box"
```
```

---

## Markdown features supported

| Feature | Syntax |
|---|---|
| Headings | `## H2`, `### H3` (auto-appear in the TOC on the right) |
| Code blocks | Fenced with ` ``` ` and an optional language tag |
| Inline math | `$E = mc^2$` |
| Display math | `$$\sum_{i=1}^{n} x_i$$` |
| Tables | Standard GFM pipe tables |
| Blockquotes | `> text` |
| Links | `[text](url)` |
| Images | `![alt](path)` |

Syntax highlighting is provided by Prism and supports Python, Bash, JavaScript, and most common languages out of the box.

---

## Customising the site

### Personal details

- **Sidebar name / tagline** — edit `SIDEBAR_HTML` in [assets/js/sidebar.js](assets/js/sidebar.js)
- **Social links** — edit the `<a>` tags in the `sidebar__social` block in the same file
- **Hero text / CTA buttons** — edit [index.html](index.html) directly
- **About page** — edit [about.html](about.html) directly

### Experience timeline

The timeline lives in [about.html](about.html) inside the `<!-- Experience -->` block. Each entry follows this pattern:

```html
<div class="timeline-item sr">
  <div class="timeline-dot"></div>
  <div class="timeline-content">
    <div class="timeline-period">Jan 2024 — Present</div>
    <div class="timeline-role">Job Title</div>
    <div class="timeline-company">Company Name · Employment type</div>
    <p class="timeline-desc">
      Brief description of what you did and the impact.
    </p>
  </div>
</div>
```

The topmost entry always gets a filled black dot (current role). Entries below it get a lighter dot automatically. Add new entries at the top of the `.timeline` div to keep the most recent role first.

### Design tokens

All colours, spacing, and typography are defined as CSS variables at the top of [assets/css/style.css](assets/css/style.css):

```css
:root {
  --font:      'Ubuntu', system-ui, sans-serif;
  --bg:        #f9f9f9;   /* page background */
  --surface:   #ffffff;   /* card / sidebar background */
  --ink-1:     #111111;   /* primary text */
  --ink-2:     #444444;   /* secondary text */
  --ink-3:     #888888;   /* muted / meta text */
  --accent:    #111111;
  --sidebar-w: 260px;
  /* ... */
}
```

Change these values to retheme the entire site at once.

### Project card images

Place SVG or image files in [assets/images/](assets/images/) and reference them in the `"image"` field of `projects.json`. The card image area has a 16:9 aspect ratio. SVGs work best since they scale perfectly at any size.

---

## Pages reference

| File | `data-page` | What it loads |
|---|---|---|
| `index.html` | `home` | First 3 projects, first 2 research, first 3 articles |
| `projects.html` | `projects` | All entries from `projects.json` |
| `research.html` | `research-articles` | All entries from `research.json` + `articles.json` |
| `post.html` | `post` | A single Markdown file (passed via `?src=` query param) |
| `about.html` | `about` | Static — edit the HTML directly |
