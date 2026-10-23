---
name: explanation-ladder
description: >-
  Convert complex topics, research, code, analyses, and language-model outputs into explanations people can genuinely understand. Use when asked to explain, teach, simplify, visualize, make a diagram, build an interactive HTML explainer, or create an animated/narrated educational video (including 3Blue1Brown-inspired explanations). Choose the smallest effective medium: ASD-STE100-inspired clear prose, a conceptual diagram, an interactive web page, or an explainer video. Do not activate for unrelated coding or ordinary brief questions that need no special explanation.
metadata:
  version: "1.0.0"
---

# Explanation Ladder

## Mission

Turn information into understanding. Optimize for **correctness, intuitive mental models, low cognitive load, active exploration, and verifiable artifacts**—not sheer output length or visual spectacle.

Think in four possible modes, from lightest to heaviest:

1. **Clear writing** — ASD-STE100-*inspired* (often roughly 80% of its stylistic strictness).
2. **Diagrams** — depict structure, causality, flow, scale, and relationships.
3. **Interactive web explainers** — let the learner manipulate a model and see consequences.
4. **Narrated explainer videos** — animate changes over time with synchronized narration.

These modes are **choices, not obligatory steps**. Use combinations only when they improve comprehension. Honor an explicitly requested format. Never silently turn a simple question into an expensive video or app.

## 1. Identify what the learner needs

Infer from the conversation when possible:

- **Audience**: age, technical background, context, language.
- **Learning goal**: what should they understand, predict, or do afterward?
- **Sticking point**: confusing terminology, hidden process, competing explanations, abstract magnitude, or changing dynamics.
- **Output constraints**: user-specified format, runtime, file type, duration, accessibility, cost, offline use.

For complex concepts, privately state the *one mental-model shift* the explanation should achieve. Avoid clarifying questions unless a missing detail prevents a meaningful deliverable. Do the work instead of writing only a proposal when implementation is requested.

## 2. Select the minimum effective medium

| Signal | Prefer | Rationale |
| --- | --- | --- |
| Definition, decision, explanation, short how-to | Clear writing | Fastest to read and verify |
| Relationships, process, hierarchy, feedback loops, timeline | Diagram | Spatial layout reveals structure |
| User should change inputs, test counterfactuals, inspect outcomes, or quiz themselves | Interactive HTML | Learning through experimentation |
| Motion is the concept, order matters, or a narrated lesson was requested | Video | Synchronized animation can show evolving states |

Escalate if the simpler medium cannot make the concept clear. For broad explanation requests, start concise and add **one** useful visual when supported; don't produce every format by default. For explicit diagram, webpage, or video requests, create the requested artifact rather than substituting another medium.

## 3. Build the explanation around insight

Use these elements selectively, not as a mechanical outline:

1. **Question / misconception**: What is the learner trying to resolve?
2. **One-sentence core idea**: Plain language, no unexplained jargon.
3. **Concrete anchor**: Familiar example, observable phenomenon, or baseline.
4. **Mechanism**: Show what changes what, step by step.
5. **Counterexample / boundary**: When does the intuition break?
6. **Check for understanding**: A prediction, worked example, or optional short quiz.

Keep claims, evidence, assumptions, and speculation distinct. Cite reliable sources when using external facts. Label simulated values, stylized graphs, hypothetical data, and not-to-scale images. Check definitions, units, axes, numerical calculations, and causal arrows.

## 4. Mode A — clear controlled-language writing

Apply the *principles* of ASD-STE100, not a false claim of formal compliance:

- Prefer short, direct, active sentences, typically one main idea per sentence.
- Use familiar words where precise; define necessary technical terms at first use.
- Prefer concrete nouns and verbs to nominalizations and abstract filler.
- Name the actor, action, and object; avoid ambiguous pronouns.
- Present prerequisites before consequences and steps in chronological order.
- Use consistent terms for one concept; avoid synonyms that obscure identity.
- Separate observation, hypothesis, implication, and recommendation.
- Use minimal formatting to expose hierarchy; cut ornamental phrasing.

**80% STE mode**: Keep natural rhythm and the few technical terms needed for precision. Do not claim that text is officially ASD-STE100 compliant. Formal compliance requires the actual controlled vocabulary and writing-rule checks.

If accuracy conflicts with extreme simplification, keep accuracy and add a short definition or example.

## 5. Mode B — diagrams and static visuals

Choose a representation that fits the question:

- **Flowchart**: decisions and processes.
- **Causal diagram**: variables, mechanisms, feedback; distinguish causal and correlated links.
- **Timeline**: order and delays.
- **Layered architecture / system map**: components and interfaces.
- **Plot**: magnitudes, comparisons, distributions; axes and units must be valid.
- **Side-by-side**: tradeoffs and contrasts.

Use Mermaid for editable diagrams when supported, SVG for exact portable vector diagrams, and other image tools only when appropriate and available. Favor 5–9 primary visual elements per view; split dense diagrams into successive views. Put meaning into position, labels, shape, and arrows—not color alone. Include text descriptions for accessibility.

## 6. Mode C — interactive HTML explainers

Build real learning tools, not static mockups:

- Prefer one self-contained `index.html` with HTML, CSS, and JavaScript, unless the project requires an existing framework.
- Show the concept immediately: a clear title, short hook, visual scene, and a first interaction.
- Use **predict → change input → observe result → explain why** where practical.
- Use meaningful sliders, toggles, buttons, comparisons, animated transitions, step controls, and short quizzes only when they help learn.
- Make every advertised control functional. Offer Reset; for timed animations, offer Pause/Replay and reduced-motion support.
- Make it readable on phones, keyboard operable, screen-reader aware, and legible in light/dark conditions. Do not encode meaning with color alone.
- Prefer offline-first and no external dependencies for standalone deliverables. If you use dependencies, disclose them and provide execution steps.
- Prefer inspectable calculations and deterministic state changes to opaque visuals; label assumptions and data sources.
- If available, run or preview the artifact and test initial load, representative interactions, mobile layout, and errors. Never state that testing happened if it did not.

Use `assets/interactive-starter.html` only as a lightweight base when useful; its appearance is not a mandatory design system.

## 7. Mode D — narrated explainer videos

When a video is actually requested or strongly justified:

1. Write a **storyboard**: each beat has learning point, visual state, movement, spoken line, and approximate duration.
2. Start from a concrete puzzle. Introduce one visual idea at a time and progressively reveal the mechanism.
3. Use a 3Blue1Brown-*inspired pedagogical approach*: geometric intuition, mathematical precision, synchronized motion, clean pacing. Make original visuals, branding, and narration; do not present the result as an official 3Blue1Brown video.
4. Prefer programmable animation such as Manim, Remotion, SVG/canvas capture, or available video tools. Choose tools that exist in the environment.
5. Produce a real playable video file when rendering is available. Generate captions or a transcript and check narration timing, legibility, audio clipping, frame continuity, and render completion.
6. Use a speech engine already available. **ElevenLabs** is optional only when the user has explicitly made credentials available and authorizes any costs. Free/local options may include Piper, system TTS, or other installed engines. Read secrets from environment variables, never embed keys in source, output, logs, or browser code.
7. If production tools are unavailable, deliver an executable project or accurate storyboard/script as a **fallback**, explicitly distinguish it from a finished video, and describe the missing dependency. Never claim a video exists when only a script exists.

Default to a tightly scoped lesson; avoid high production cost or multi-minute renders unless the value or user request warrants it. More detail in `references/video-playbook.md`.

## 8. Verify before delivery

Check all relevant conditions:

- **Correct**: technical statements, quantitative values, units, timelines, and definitions agree.
- **Comprehensible**: learner can state the central idea after one pass.
- **Visual necessity**: the chosen medium makes the idea easier to understand than text alone.
- **Interactive integrity**: controls visibly affect correct state; no placeholder buttons or broken logic.
- **Accessible**: adequate contrast, readable type, alternative text, keyboard navigation, reduced motion as relevant.
- **Executable**: files exist, imports resolve, and dependencies/instructions match reality.
- **Trustworthy**: uncertainty and hypothetical elements are labeled; no invented citations or test claims.

Deliver the **artifact and a short explanation of how to use it**, not a long description of work the learner still needs to do.

## 9. Output contract

- If the user asks a question: **answer it**, usually in clear writing, adding a diagram only if it materially helps.
- If the user asks for a diagram: provide a usable visible diagram or diagram source in a format their environment supports.
- If the user asks for an interactive webpage: produce runnable HTML/app code and, when the environment supports it, a working file or preview.
- If the user asks for a video: produce a playable file if tooling supports rendering, otherwise a clearly labeled executable video project or storyboard as the fallback.
- If the user specifies output constraints (duration, medium, aspect ratio, tools, cost, offline), obey those over defaults.
- Don't equate polished appearance with accurate explanation.

## Example invocations

- `Use $explanation-ladder to explain how inflation changes purchasing power to a teenager. Start with a mental model.`
- `Use $explanation-ladder to turn this technical architecture into a causal diagram.`
- `Use $explanation-ladder to make an offline interactive HTML demo with a slider and a prediction quiz.`
- `Use $explanation-ladder to create a 90-second animated explainer of Bayes' theorem, with narrated animation and captions.`
