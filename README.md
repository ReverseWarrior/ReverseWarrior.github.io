# Liel's Blog

A reference for future me, so I remember how to operate this blog.

## How it works

You write posts as Markdown files in `_posts/`. When you push to GitHub, GitHub Pages runs Jekyll and publishes the generated HTML automatically — no build step or GitHub Action required.


### If it's a project site (not `ReverseWarrior.github.io`)

Open `_config.yml` and set:

```yaml
baseurl: ""
url: "https://ReverseWarrior.github.io"
```

Otherwise stylesheets/links will 404.

## Write a post

Create `_posts/YYYY-MM-DD-my-post-slug.md`:

```markdown
---
layout: post
title: "Post title"
date: 2026-04-21 09:00:00 +0000
tags: [tag1, tag2]
---

Your Markdown content here.
```

Commit and push — it appears on the home page automatically.

## Preview locally (optional)

You only need this if you want to see changes before pushing. GitHub Pages will build the site for you on every push regardless.

Requires [Ruby](https://www.ruby-lang.org/) (3.x recommended on Windows — use [RubyInstaller](https://rubyinstaller.org/) with Devkit).

```bash
gem install bundler
bundle install
bundle exec jekyll serve --livereload
```

Then open `http://localhost:4000`.

## Project layout

```
_config.yml         Site settings (title, URL, author)
_layouts/           HTML templates (default, post)
_includes/          Header, footer, <head>
_posts/             Your posts (Markdown)
assets/css/         Styles (CSS variables drive light/dark)
assets/js/theme.js  Theme toggle, mobile nav, post TOC
index.html          Home page (about, socials, PGP)
posts.html          Full post list at /posts/
```

## Customize

- **Title / author**: `_config.yml`
- **About me blurb**: `about:` key in `_config.yml` (supports Markdown)
- **Social links**: `socials:` list in `_config.yml` — platforms supported out of the box: `github`, `twitter`, `linkedin`, `mastodon`, `rss`. Add more by editing `_includes/social-icon.html`.
- **PGP key**: replace the ASCII-armored block inside the `<pre class="pgp-block">` in `index.html`.
- **Colors**: CSS variables at the top of `assets/css/style.css`
- **Max width / typography**: same file
- **Nav links**: `_includes/header.html`


