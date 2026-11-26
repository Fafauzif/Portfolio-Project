---
slug: "typesetter"
title: "Typesetter"
summary: "A little browser instrument for seeing what changes when a typeface changes weight and width."
category: "builds"
kind: "experimental"
year: 2024
role: "Design and prototyping"
client: "Independent"
cover: "/portfolio-media/typesetter.webp"
imageAlt: "Typesetter cover artwork featuring type at several weights and widths."
tags: ["Web toy", "Typography", "Creative coding"]
featured: false
lab: true
accent: "#9ecdb9"
---

## Make the settings legible through the type

Variable font controls can feel detached from the sentence. Change two controls at once, and it is difficult to tell which one made the change you are looking at. I built Typesetter for a single line of type, shaped by a small set of visible controls.

## Keep one place to look

The first prototype used a draggable field with both axes. It felt good with a mouse and gave people little guidance about where they were. I replaced it with labeled sliders, a reset, and three saved states that can be compared directly. The same type remains centered so the visitor can read its silhouette as it changes.

I designed the controls, set the specimen at responsive sizes, and built the component that applies the chosen values. A no-script state keeps the default specimen visible.

## A useful limit

The type should take up most of the frame. Keeping the screen to a few deliberate choices made the specimen more helpful for someone teaching the idea. A future version could let another person supply their own variable font after seeing how the example works.
