# Noah Mamié

PhD researcher and UZH.ai Fellow at the University of Zurich ([DDIS group](https://www.ifi.uzh.ch/en/ddis.html), [DSI Excellence Program](https://www.dsi.uzh.ch/en/education/excellence-program.html)).

**Website: [mamié.ch](https://mamié.ch)** · [Google Scholar](https://scholar.google.com/citations?user=JhXjm_sAAAAJ) · [LinkedIn](https://www.linkedin.com/in/noah-mamie) · [Medium](https://medium.com/@nmamie) · [Bluesky](https://bsky.app/profile/nmamie.bsky.social)

I work on **generative AI for personalized news recommendation**, evaluated in field studies with real readers on [Informfully](https://informfully.ch), and on **collective intelligence**: how swarms of foundation models can reason better together than alone.

## Selected publications

- **Reproducing Transparent and Scrutable Recommendations: Exploring Open-Weight Models via Natural-Language User Profiles**
  N. Mamié, L. van den Bergh. *BlackboxNLP Workshop @ EMNLP 2026.* [Paper](https://aclanthology.org/2026.blackboxnlp-1.74/)
- **The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligence**
  N. Mamié, S. X. Rao. *ICSI 2025.* [Paper](https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20) · [Code](https://github.com/nmamie/HiveLLM)
- **Voting Booklet Bias: Stance Detection in Swiss Federal Communication**
  E. Egli, N. Mamié, M. Müller, E. L. Dolev. *SwissText 2023, Best Poster Award.* [Paper](https://arxiv.org/abs/2306.08999) · [Code](https://github.com/ZurichNLP/voting-booklet-bias)

## Projects

- [Informfully](https://informfully.ch): research platform for field studies with personalized news on iOS, Android and web.
- [HiveLLM](https://github.com/nmamie/HiveLLM): evolutionary multi-agent framework for swarms of LLMs.
- [Voting Booklet Bias](https://github.com/ZurichNLP/voting-booklet-bias): multilingual stance detection for Swiss voting booklets.

---

## About this repository

Source of [mamié.ch](https://mamié.ch): a React + Vite + Tailwind/daisyUI site, deployed to GitHub Pages by [`deploy.yml`](.github/workflows/deploy.yml) on every push to `main` and daily at 04:00 UTC.

```bash
npm install
npm run dev       # local preview at http://localhost:5173
npm run build
```

### Updating content

| What | Where |
| --- | --- |
| Papers, news, talks, projects, CV, links | [`gitprofile.config.ts`](gitprofile.config.ts) |
| Paper figures and images | `public/img/` |
| Blog posts written on this site | `src/posts/<slug>.md` (see below) |
| Bio and research areas | [`src/components/site/intro.tsx`](src/components/site/intro.tsx), [`research-overview.tsx`](src/components/site/research-overview.tsx) |

**Blog posts.** Add a Markdown file to `src/posts/` and push. It appears under *Writing* next to Medium, Substack and LessWrong posts, and is readable at `/#blog/<slug>`:

```markdown
---
title: My post
date: 2026-11-09
description: Optional teaser
thumbnail: /img/cover.png
tags: [Recommender Systems]
draft: false
---

Post body in **Markdown**.
```

**Comments** under these posts use [giscus](https://giscus.app) and are stored in this repo's [Discussions](https://github.com/nmamie/nmamie.github.io/discussions) (category *Announcements*). Settings are in the `comments` block of the config.

**Citations and external posts** refresh on every deploy, so at least daily:
- `npm run update-citations` scrapes Google Scholar into `src/data/citations.json` (per-paper counts, totals and citations per year).
- `npm run update-posts` caches Medium, Substack and LessWrong posts into `src/data/external-posts.json`.

If Scholar blocks GitHub's servers, the last saved counts are kept. Run the script locally and commit the result.

---

Built on [arifszn/gitprofile](https://github.com/arifszn/gitprofile) (MIT).
