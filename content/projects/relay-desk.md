---
slug: "relay-desk"
title: "Relay Desk"
summary: "A shift-swap app that keeps the original booking in place until a replacement is confirmed."
category: "builds"
kind: "build"
year: 2026
role: "Product designer and developer"
client: "Relay Volunteer Network"
cover: "/portfolio-media/relay-desk.webp"
imageAlt: "Laptop displaying the Relay Desk schedule on a blue-gray worktable with notes."
tags: ["Web app", "Workflow design", "Prototyping"]
featured: true
lab: false
accent: "#9ecdb9"
---

## What broke in the group chat

A volunteer who could not make a shift posted in a chat, waited for someone to reply, then hoped a coordinator saw the thread. A shift looked covered when two people had simply agreed in principle. The spreadsheet might still show the original volunteer.

I followed three swaps from request to handover. The biggest friction appeared between two people expressing intent and the coordinator actually changing the roster. More alerts would have made that middle step louder without making it more definite.

## Design around the booking that already exists

I reduced the workflow to three states: offered, claimed, and confirmed. The current assignment stays in place through the first two. A coordinator can confirm a claim or send it back with a reason. The old and new assignments change together, preserving who is responsible throughout.

The alternative was a marketplace-like flow with negotiation, multiple offers, and availability scores. It gave people flexibility, but the coordinator would still have to untangle ambiguity. Relay Desk has one actionable request per shift and a predictable path to undo a mistaken action.

![The original volunteer remains assigned in the Offered and Claimed states. The replacement appears on the roster at Confirmed.](/portfolio-media/relay-desk-process.webp)

## What I built

I designed the queue and implemented the request form, coordinator view, and event log. The queue gives the next action a clear owner. A volunteer sees whether they are still on the roster. A coordinator sees which shifts have a claim ready for a decision. The activity log explains how a shift got there.

I kept notification messages short and linked back to the request. A reply in email is easy to miss. A reply inside the request gives the next person the same context.

## Test the failure cases

I checked two people claiming the same opening, a requester withdrawing during review, a coordinator reversing a confirmation, and a narrow mobile viewport. In each case we looked for a single answer to the same question: who is expected to show up? Early feedback also moved claim deadlines from the footer to the request itself.

The first release was a narrow pilot with one schedule. It established a workable handoff for that schedule. The remaining question is how much a second team can reuse without importing the assumptions of the original roster.

## What I’d keep small

The roster owns the booking. The exchange records intent and decisions. Preserving that boundary makes it easier to integrate with a different scheduling system later.
