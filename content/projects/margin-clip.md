---
slug: "margin-clip"
title: "Margin Clip"
summary: "A small browser extension for saving excerpts with the context needed to trust them later."
category: "builds"
kind: "extension"
year: 2026
role: "Product design and extension development"
client: "Independent"
cover: "/portfolio-media/margin-clip.webp"
imageAlt: "Margin Clip artwork showing a browser-based excerpt capture tool."
tags: ["Browser extension", "Research tools", "Prototyping"]
featured: false
lab: true
accent: "#9ecdb9"
---

## A pile of links with no memory

When I opened my browser bookmarks during research, I remembered the article I had saved and forgot why. Full-page clipping encouraged me to keep everything. A copied paragraph lost the sentence beside it and the date I read it.

I designed Margin Clip to save a selection, one line of my own, and enough source context to find the passage again. The first draft opened a popup with seven fields. I cut it down to the visible excerpt and a short optional note.

## Store one useful record

The capture flow keeps the title, page URL, and capture date together. The extension requests access to the current page after a deliberate click. It stores the clips locally and exports them in a readable format. I chose local storage because this prototype needed to earn the right to ask for an account.

I designed and coded the popup, keyboard flow, and export. Quick testing surfaced clipped text in narrow windows and empty selections that looked like successful saves. I made both states explicit and kept a link to the source within each saved record.

## What stays in the browser

The demo supports capture, re-open, and export. I left automatic categorization for later. A single user-supplied sentence has proved more useful in my own notes than a label guessed before I understand the material.
