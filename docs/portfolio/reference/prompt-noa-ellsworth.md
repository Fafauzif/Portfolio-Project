# Noa Ellsworth — the sea, the ring of site cards, the sentence as navigation

> **Partial.** Sections 6b–12 are verbatim. Sections 1–6a (tokens, type, the scene layers, the nav, the sentence bar's markup) were cut off in transit and are missing. Ask Fauzi to re-paste the original and replace this file. Do not reconstruct the missing sections.

---

## 6b. Ring geometry and card placement (verbatim from here)

Cards: 16 slots, one per site. Each card is an anchor (opens the motionsites link in a new tab), height 160 px and width 160 × the site's ratio (so 284 px for 16:9, 256 px for 16:10, 240 px for 3:2), positioned with its centre on the ring centre (top −80 px, left −width/2), preserve-3d, starting at opacity 0. Inside: a tilt wrapper (preserve-3d), a frame (inset −9px, 3px border in the world colour, radius 24px, glow 0 40px 80px −30px world colour, clip-path inset(0 100% 0 0 round 24px) that opens to full in .55 s on hover), and the face (radius 16px, overflow hidden, backface hidden, navy #0E2A3B fill, shadow 0 18px 36px −24px rgba(0,0,0,.45), and a reflection below it: `-webkit-box-reflect: below 10px linear-gradient(transparent 52%, rgba(255,255,255,.32))`). The face holds the poster image (cover), the preview video (cover, muted, loop, playsinline, preload none, opacity 0 → 1 over .4 s on "playing"), a chip at bottom-left (14px in, pill, rgba(0,0,0,.45) background, white Geist Mono 13px, a 6px dot in the world colour, text "No. 01" … "No. 16"; it fades out on hover), and a label bar (12px from left/right/bottom, padding 11px 14px, radius 12px, world colour background, `--on` text; contents: world label in Geist Mono 500 12px .12em tracking, the site title in Newsreader 22px truncated, and an "↗" that springs from translate(−6px,6px) to 0 over .5s cubic-bezier(.34,1.56,.64,1) with .15 s delay; the bar is revealed by clip-path from the left over .5 s with 50 ms delay on hover). A paper-coloured overlay on the face rises to opacity .6 on cards whose world is not the one currently focused by the sentence hover.

Slot → site mapping: slot e shows site `((e − a·16 + min(3, N−1)) mod N + N) mod N`, where a = floor((360e/16 + rotation + 180) / 360) and N = 16 (with exactly 16 sites this is a stable offset of 3; during the intro rotation is treated as 0). Slot angle: `angle(e) = ((((360e/16 + rotation + 180) mod 360) + 360) mod 360) − 180`.

Ring geometry for expansion e ∈ [0,1] (e = 0 small intro ring, e = 1 final ring):
- tilt = −22 × (1 − e) degrees
- radius = 460 + 1340 × e
- anchor = −radius × sin(tilt) + 460 × sin(−22°) × (1 − e)
- perspective = 1000 + (760 − 1000) × e (final camera distance 760)
- roll = −20 × (1 − e) degrees
- card scale = 0.52 + (2.3 − 0.52) × e²

Card placement for a slot with angle r and formation f ∈ [0,1]: n = ((r + 180) mod 360), a = n/360, i = clamp((f − 0.7a)/0.3, 0, 1), s = 1 − (1 − i)³, yaw l = −180 + n × s, effective radius c = radius − (1 − s) × a × 24, x = −sin(l) × c, z = −cos(l) × c, appear = min(1, 2.5 i). The card transform is translate3d(x, 0, z) rotateY(l deg) scale(card scale) and its opacity = appear. A card is hidden if z × cos(tilt) ≥ perspective − 70 (behind the camera), or, once the intro is complete, if |r| > 96°. If z > radius² / perspective, the face is flipped with rotateY(180deg).

Per-frame camera values (A = wall-scale × (fit + (1 − fit) × e), fit = min(1.05, (innerWidth − 32)/1240, 0.66 × innerHeight/800) ÷ wall-scale, introOff = 0.44 × innerHeight − frame centre y): --intro-offset = introOff × (1 − e) + anchor × A px; lens perspective = perspective × A px; lens perspective-origin = 50% calc(50% + introOff × (1 − e) px); --intro-tilt, --intro-roll in degrees; --intro-x = 160 × sin(roll) × A px; --intro-sz = A; --intro-scale = fit + (1 − fit) × e. (So during the intro the small ring sits centred at 44% of the viewport height, tilted and rolled, slightly to one side, and it grows into the frame.)

Rotation: a target value m and a displayed value g that follows m with a spring (stiffness 150, damping 27, mass 1). Every frame (frame factor k = dt in ms ÷ 16.67, capped at 3): an easing factor E moves toward 0.2 when the mouse is over a card (checked every third frame with elementFromPoint) and toward 1 otherwise, by min(1, 0.08 k) of the gap. If not dragging, not focused inside the wall and not reduced motion, m increases by 0.3 × E × k degrees once the intro is complete; during the intro by 0.3 × (0.5 + 0.5e) × clamp((78 − m)/20, 0, 1) × E × k (so it spins until about 78° and eases off).
- Wheel (window listener, non-passive, Home view only, ignored over inputs or with Ctrl/Meta; it always prevents page scroll): delta = the larger of deltaY/deltaX, ×16 for line mode or ×innerHeight for page mode, then m += 0.5 × clamp(delta, −480, 480). Only after the intro completes.
- Drag (mouse button 0 on the wall, after the intro): m = start m + 0.2 × (the larger-magnitude of dx, dy); moving more than 4 px marks it a drag, and a click right after a drag (within 50 ms) is cancelled; cursor shows "grabbing".
- Touch (one finger, not starting on a card or input): same 0.2 factor.
- With reduced motion the spring jumps straight to the target.
- Card hover tilt: on mouse move over a card, normalised x/y in −0.5…0.5 set targets rotateX = −20 × y, rotateY = 24 × x, translateZ = 45 px, each on its own spring (stiffness 180, damping 24); leaving resets them to 0. Applied to the tilt wrapper.
- Videos: a card's preview video plays only when formation > 0.5, |angle| ≤ 78°, the tab is visible, the Home view is shown and reduced motion is off; its src is set the first time it needs to play; it pauses otherwise. When a slot's site changes, the video is paused, its src removed and reloaded.

## 6d. Sentence hover and preview card

Only after the intro has entered. Hovering a choice marks it active and the sentence "hovering": all words drop to opacity .28 except the active choice, whose words turn the `--on` colour while its marker sweeps in (scaleX 0 → 1, .5 s main ease) behind it in the world colour. For build/brand/learn the stage gets a focus attribute that dims every card of another world (a page-black overlay to .6). A preview card follows the pointer: a fixed anchor translated to the pointer by springs (stiffness 260, damping 28, mass 0.6), holding a 260 px card (radius 16px, surface background #141C22, shadow 0 30px 60px −28px #000 and a 1px rgba(238,244,246,.1) ring), placed so it always stays fully on screen: by default its bottom-left corner sits 18 px right of and 22 px above the pointer; if there is not room above (it would come closer than 12 px to the top edge) it flips to 22 px below the pointer, and if there is not room on the right it flips to the left side (18 px gap); a 24 px hysteresis stops it flickering on the threshold, and the final position is clamped 12 px inside every viewport edge; its transform-origin follows the corner nearest the pointer; opacity 0/scale .85 → 1/1 (.25 s / .35 s). Its media area is 146 px tall, shows that site's poster as its background (and as the video poster) straight away, and plays the first site of that world (Look Circle for brand, Video Studio for build, Sphere Gallery for learn); below it a meta block (12px padding 14px, 12px Geist, line-height 1.5): a Geist Mono 500 11px .1em line with an 8px world-coloured square, "BRAND · LOOK CIRCLE" style text, then the world blurb. For "chat with Noa" the card turns night (#05090C), the media hides, and it shows "Ask me anything" in Newsreader 28px white with a 2px aqua caret blinking every 1 s (step-end), label "NOA'S ASSISTANT", blurb in #9fb4bf. Leaving the sentence clears everything and pauses the preview video. Clicking "startups" opens the Build view.

## 7. Build view (desktop)

A flex column, min-height 100svh − 92u.

- Panel: margin −15u 22u 0 24u (it starts at about y 77), height 716u, radius 24u, clip-path inset(0 round 24u), overflow hidden, background paper-deep, flex column centred. Inside: the same scene layer (sea still + sea video, object-position 50% 70%, grain, parallax depth 10) and a back petal layer containing all 17 petals.
- Headline: two lines "I take startups" / "from sketch to ship.", centred, Newsreader weight 460, 88u, line-height 76u, letter-spacing −0.015em, colour #0E2A3B (dark navy: it sits directly on the bright sky, so it stays dark in dark mode for contrast), margin-top 86u. Each word is masked and rises from translateY(110%) over .8 s main ease with delay 0.15 s + 0.06 s × index when the view is entered. A visually hidden line reads "Build: software for startups".
- Brief card: margin-top 60u, width 542u, padding 28u 30u 25u, radius 16u, dark glass: surface #141C22 at 86% (color-mix) with 10px backdrop blur, shadow 0 40px 80px −40px rgba(0,0,0,.8) plus an inset 1px rgba(238,244,246,.08) ring; all its text uses the light ink tokens, column gap 14u. It fades up (opacity 0, translateY 16px → 0 over .9 s, delay .45 s). Contents:
  - Kicker "SHARE WHAT YOU'RE CREATING": Geist Mono 11u, .1em, uppercase, ink-soft.
  - Sentence in Newsreader 25.5u, line-height 41u, three lines on desktop: "I'm creating [a booking app for gyms]" / "for [coaches in Porto], and I want it" / "[in 6 weeks] by next May / when it's ready." The blanks are text inputs styled as underlines (width = characters × 0.5em, with 23 and 17 characters; 1.5px ink-muted bottom border that turns accent on focus; placeholder ink-muted). The timeline is a radiogroup of three buttons ("in 6 weeks" checked by default, "by next May", "when it's ready", with a space before the second and " / " before the third); each button is ink-muted with a button-blue (#1E86AC) highlight behind it (inset .12em −.1em .04em, radius .22em, scaleX 0 → 1 from the left over .5 s) shown on hover and when checked, which also turns its text white; clicking selects it.
  - Note "GOES TO ME@NOAELLSWORTH.COM. NOA REPLIES, ALWAYS." in the kicker style.
  - Actions row (gap 14u): two 44u round ghost buttons (inset 1px line ring, ink-soft icon 20u, ring 1.5px ink on hover) — an eight-ray asterisk ("Copy this brief": copies the composed sentence to the clipboard and shows "Brief copied" in accent mono 11u for 1.6 s) and a target/orbit icon ("Share this brief": the Web Share API, or copy as a fallback) — then the send button "Send to Noa ↗": 40u tall pill, padding 0 22u, button-blue #1E86AC background (hover #2597C0), white Geist Mono 13u. The button is magnetic: on mouse move it translates by 0.3 × the x offset and 0.4 × the y offset from its centre, resetting on leave. Submitting opens `mailto:me@noaellsworth.com` with subject "A new brief" and body "Hi Noa, I'm creating <what> for <who>, and I want it <when>. Could we talk?" (empty blanks fall back to their placeholders).
- Under the panel: "WORKED AT" kicker (padding 24u 53u 26u) and two wordmarks 48u apart, Newsreader 27u: a wave line icon + "Fernway" and a peak line icon + "Quill Labs" (icons 42u wide, ink-soft, 1.6px strokes). Fades up with .7 s delay.

## 8. Opening sequence (Home)

| Time | What happens |
|---|---|
| 0 | Full-screen loader (fixed, z 100, page-black #0A0E11 background, light #EEF4F6 text). Top-left (3.2vh, 4vw), "Noa." in Newsreader clamp(64px, 9vw, 150px), line-height .95, −0.03em: each letter is in a mask and rises from translateY(105%) rotate(8deg) to rest over 1 s main ease with delays 0.10 / 0.18 / 0.26 / 0.34 s. Bottom-right (4vh, 5vw): the caption types "LOADING SITES" one character every 45 ms starting at 350 ms (Geist Mono 12px, .14em, ink-soft); below it a three-digit odometer (Geist Mono clamp(80px, 12vw, 180px), −0.09em tracking, each digit a column of 0–9 that slides .7 s main ease; unused leading digits hidden) rises into its mask over .9 s with .2 s delay, followed by a small "%". Bottom-left: a 44px round skip button "↗". |
| 0–2.6 s | Formation goes 0 → 1 linearly over 2.6 s: cards sweep around the small tilted ring one after another (placement formula above) above the loader (the wall and frame are z 101 with the frame clip open and its scene layers hidden). Meanwhile the odometer counts to (posters loaded ÷ 16) × 100, each change tweened over .65 s main ease; a 9 s failsafe forces 100%. |
| reveal (formation done and all posters loaded) | The loader fades out over .9 s and is removed after 1 s; the odometer slides up out of its mask (.5 s, cubic-bezier(.6,0,.8,.4)); the frame drops its open clip and animates to the rounded frame (1.1 s); its scene layers fade in (.9 s) and the mist rises (1.6 s); expansion goes 0 → 1 over 1.9 s with cubic-bezier(.5,0,.15,1); the loader "Noa." flies to the nav's "Noa" over 1.3 s with cubic-bezier(.65,0,.35,1) (translate to the target's top-left and scale by the ratio of font sizes) while its "." fades out over .5 s; when it lands, the real wordmark and nav fade in and the flying copy is removed. |
| reveal + 1.05 s | The page is marked "entered": sentence words rise (staggered), underlines draw in (1 s, delayed .35 s after each word), superscripts fade in, stats fade up. |
| reveal + 1.9 s | Expansion complete: the ring becomes interactive (wheel, drag, hover), its slot mapping follows rotation, and the constant 0.3°/frame auto-spin starts. |

Escape, Tab or the skip button (1px rgba(238,244,246,.16) ring) jumps straight to the final state. With reduced motion, or when the page is opened directly on #build, the intro is skipped entirely.

## 9. Views and routing

The two views are sections with ids view-home and view-build (not "home"/"build", so the #build hash never scroll-jumps). Links carry data-go="home"/"build"; clicking one shows that view, hides the other, plays a .6 s opacity fade-in on the shown one, updates aria-current in the nav, pushes #home or #build to history (back/forward work), scrolls to top, re-runs the Build entrance when entering Build, and switches the sea video so only the visible view's video plays (it starts loading the first time its view is shown). Opening the URL with #build lands on Build.

## 10. Phone and tablet (≤ 820 px)

Unit becomes 100vw/390. Nav 64 px tall, padding 0 16px, wordmark 24px, links 11px with 7px gap. Home: top row becomes one column (14px row gap, padding 4px 16px 16px); the sentence is clamp(26px, 7.4vw, 32px) with line-height 1.12, the forced line breaks and superscripts are removed so it reflows naturally; stats lose the outer line, columns get 16px side padding and a 6px gap, numbers 26px, labels 10px. The frame gets margin 0 10px 10px and radius 20px; the ring's wall-scale is 0.8. Build: panel margin 0 10px, auto height with min-height 100svh − 170px, bottom padding 22px, radius 20px; headline 46px/42px with 34px top margin and 12px side padding; the brief is full width minus 24px, padding 20px 18px, radius 14px, gap 12px, kicker 10px, sentence 22px/36px with its desktop line breaks removed and blanks at 0.44em per character; ghost buttons 40px (18px icons); send 40px tall, 12px text, padding 0 18px, never wrapping; "worked at" padding 18px 20px 24px, wordmarks 22px with 34px icons and 28px gap. There is no horizontal scrolling at any width from 320 px up.

## 11. Reduced motion

`prefers-reduced-motion: reduce` hides the loader, stops the petals, motes and grain jitter, shows all text instantly with no transitions on masks, underlines, markers, frames or labels, keeps the scene as the still image (videos never play), keeps the ring static at its final shape, and makes wheel/drag move it directly without the spring. Changing the setting live re-applies this.

## 12. Acceptance checklist

- At 1440×900 after the intro: the sentence occupies three lines between about y 100 and y 225, the stats sit at the right behind a vertical line, the frame starts near y 255, and about seven landscape cards are visible in a gently curved row over the water with reflections, the outer ones larger and cut by the frame edge.
- The intro reads in order: name rises, count runs to 100, ring forms tilted above the loader, loader fades while the ring opens around you, the clip closes to the rounded frame and "Noa." lands in the nav.
- Wheel and drag spin the ring with spring easing; hovering a card slows the spin, tilts the card toward the cursor and reveals its frame and label; clicking opens the motionsites page.
- Hovering each sentence choice dims the rest, sweeps its marker, dims other worlds' cards and shows the matching preview; "chat with Noa" shows the dark assistant card.
- Build shows the centred headline, the brief with working blanks, radio chips, copy, share, magnetic send and mailto.
- The sea video loops on whichever view is showing; the still shows until it plays.
- No horizontal scrollbar at any size; layouts hold at 320, 390, 768, 1024×768 and 1440×900.

---

## What to take from this one

- **The sentence is the navigation.** Not a menu with a metaphor — the actual sentence the page is about, with its nouns as the controls. That is the single best idea across all four references.
- **A real photograph as the ground.** The sea, the mist, the petals. The 3D ring sits in a photographed world, not a void. This is the exact thing the SIGNAL build is missing.
- **One unit drives everything.** `100vw/390` on mobile, `u` on desktop; every margin, size and radius is a multiple. This is why it holds at 320 through 1440 without a single breakpoint fight.
- **The preview card that refuses to leave the screen**, with a 24px hysteresis so it cannot flicker at the threshold. Craft in a detail nobody would have noticed missing.
- **Honesty in the copy:** "NOA REPLIES, ALWAYS." A promise the design can keep because it is one person.
- The intro does not fade things in — every reveal is a mask slide, a clip, a scale, or an odometer. **Zero opacity fades on content.**
