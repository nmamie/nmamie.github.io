---
title: EMNLP 2026 Review 
date: 2026-11-15
description: Fairness, Personalization, and the Future of Recommender Systems
tags: [Conference Report, Recommender Systems, Interpretability]
thumbnail: /img/emnlp26-thumb.jpg
dateline: Budapest
draft: false
---

I just returned from EMNLP 2026 in Budapest, where I had the opportunity to present our work on transparent user profiles for recommender systems and attend several sessions that directly relate to my research. Here are some key insights from the conference.

## Our Poster: Transparent User Profiles

We presented a poster on using natural language user profiles to make recommendation systems more transparent and scrutable. The core idea is straightforward but powerful: instead of opaque embedding vectors, represent users as readable text descriptions that can be inspected, edited, and understood by both humans and downstream models. This approach bridges the gap between traditional collaborative filtering and modern LLM-based personalization, offering interpretability without sacrificing performance.

<figure class="poster">
  <a href="/papers/EMNLP_BlackBox_Poster_UZH.pdf" target="_blank" rel="noopener">
    <img src="/img/emnlp26-poster.jpg" alt="Poster: Reproducing Transparent and Scrutable Recommendations — Exploring Open-Weight Models via Natural-Language User Profiles" loading="lazy" />
  </a>
  <figcaption>Our BlackboxNLP poster at EMNLP 2026: <em>Reproducing Transparent and Scrutable Recommendations: Exploring Open-Weight Models via Natural-Language User Profiles</em> (Noah Mamié &amp; Laurin van den Bergh). Click to open the full-resolution PDF.</figcaption>
</figure>

<aside class="resources">
  <p class="resources-label">Read more</p>
  <ul>
    <li><a href="https://aclanthology.org/2026.blackboxnlp-1.74/" target="_blank" rel="noopener"><span>Paper</span> ACL Anthology · BlackboxNLP 2026</a></li>
    <li><a href="https://github.com/nmamie/transparent_user_profiles" target="_blank" rel="noopener"><span>Code</span> github.com/nmamie/transparent_user_profiles</a></li>
    <li><a href="/papers/EMNLP_BlackBox_Poster_UZH.pdf" target="_blank" rel="noopener"><span>Poster</span> PDF, full resolution</a></li>
  </ul>
</aside>

The feedback we received was encouraging, and several attendees noted that this direction aligns with growing industry interest in explainable AI for recommendation systems.

## Fairness in LLM-Based Recommender Systems: Still Undefined

One of the most striking sessions I attended was a survey on fairness in LLM-based recommender systems. The key takeaway? **There is still no common definition of "fairness" in this space.** Different papers use different metrics, evaluate different aspects, and often don't even talk to each other. This makes it hard to compare results across studies or build cumulative knowledge.

The survey also identified a significant blind spot: **social and attribute bias**, particularly on the "item side" of recommendations. Most fairness work focuses on user-side metrics (e.g., is everyone getting equally good recommendations?) but pays less attention to whether items themselves are being represented fairly across different social or demographic attributes. For example, are news articles from certain regions or perspectives systematically underrepresented in personalized feeds?

## Personalized News: The Next Frontier

Several talks and posters touched on personalized news recommendation, which is particularly relevant given my own research interests. The trend I observed is a shift away from pure content-based filtering toward hybrid approaches that combine user modeling with contextual understanding. LLMs are being used not just to generate recommendations but to understand the *why* behind them — providing explanations that users can actually trust.

One interesting direction involves using knowledge graphs to ground personalized news in factual relationships, reducing hallucination and improving the reliability of explanations. This connects directly to my work on grounding personalized news in external knowledge.

## The Broader Picture: Interpretability as a First-Class Concern

Across all sessions, I noticed a recurring theme: **interpretability is becoming a first-class concern** in NLP research, not just an afterthought. Whether it's fairness metrics, personalized news explanations, or transparent user profiles, researchers are increasingly asking "can we understand why this system made this decision?" rather than just "does it work well on the benchmark?"

This is an exciting time to work on personalized recommendations, especially in the news domain. What is your take on news personalization and especially the usage of AI in this context?