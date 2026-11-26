---
slug: "transit-board"
title: "Transit Board"
summary: "A prototype status board that stays informative when a station’s data connection fails."
category: "builds"
kind: "prototype"
year: 2026
role: "Interaction designer and front-end developer"
client: "Bramble Regional Transit"
cover: "/portfolio-media/transit-board.webp"
imageAlt: "Transit Board prototype artwork showing status rows and update times."
tags: ["Offline UI", "Transit", "Front-end"]
featured: false
lab: false
accent: "#9ecdb9"
---

## Show how old the information is

A board stops being useful if a network failure looks like an ordinary delay. I built an interaction prototype for a regional operator that separates the last received update from the current connection.

I started with the rider choices identified in [Transit Notes](/work/transit-notes/). The most important question was whether to trust the board. I added an explicit time against each update and a plain offline state before adding route detail.

## A design that survives one missed connection

The latest usable snapshot remains on screen, with its age displayed next to the status. The next update can replace it without clearing the display. An older snapshot is still useful for stop location, but should lose priority once it can no longer answer whether a service is running.

I designed the row states and built the simulation. It includes a way to reproduce an outage and watch the typography change.

## Test in a normal-sized room

We tested the prototype from standing distance and on a small monitor. Soft gray values disappeared before the bold labels did. I raised their contrast and shortened the note attached to a cached update. The prototype uses a simulated dispatch feed to make offline behavior easy to reproduce.
