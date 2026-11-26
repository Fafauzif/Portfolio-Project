---
slug: "receipt-loop"
title: "Receipt Loop"
summary: "A referral ledger that lets workshop staff trace each credit from the original request to redemption."
category: "builds"
kind: "automation"
year: 2026
role: "Workflow developer"
client: "North Loop Workshop Collective"
cover: "/portfolio-media/receipt-loop.webp"
imageAlt: "Receipt Loop cover showing linked records and a credit workflow."
tags: ["Automation", "Workflow design", "Operations"]
featured: false
lab: false
accent: "#9ecdb9"
---

## Treat a credit as a record

Referral credits moved through registration forms, inboxes, and a manual spreadsheet. Staff needed to tell when a referral had been recorded, whether it qualified, and whether the corresponding credit had been used.

I created a single workflow around those questions. Each referral gets its own reference. The ledger keeps issue and redemption separate so someone can reconcile a credit without reading the thread that led to it.

## Build for the twice-submitted form

Duplicate entries arrived when a participant retried a slow confirmation. I set the rules so a repeated submission returns the existing record. Staff adjustments create a separate ledger entry. The workflow records withdrawal and expiry explicitly, which is easier to check than clearing a cell.

I owned the configuration, form changes, validation, and staff instructions. The operations team decided which activities qualified for a credit and what they would do with exceptions.

## Hand off the exceptions

In a test session we walked through a duplicate, a repair, and a case where two different people shared a contact address. The handoff included example records for each. That gave a staff member something to compare with the live ledger when a form produced an unusual result.
