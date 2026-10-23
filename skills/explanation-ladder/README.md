# Explanation Ladder — Agent Skill

An instruction-only, portable Agent Skill to turn complex information into understandable prose, diagrams, interactive HTML, or narrated educational video.

## Install

**Codex, personal / all projects (macOS, Linux, Omarchy):**

```bash
mkdir -p ~/.agents/skills
cp -R explanation-ladder ~/.agents/skills/
```

**Codex, current repository:**

```bash
mkdir -p .agents/skills
cp -R explanation-ladder .agents/skills/
```

Open the extracted archive's parent directory when running those commands, or change the source path to the extracted folder's location. Changes may require restarting the agent to refresh skill discovery.

## Use

In Codex or a compatible agent, ask:

> Use $explanation-ladder to explain compound interest with a simple interactive HTML model and a prediction quiz.

Or invoke it implicitly:

> Create a short visual explanation of how a neural network learns. Make the cause-and-effect clear before you use equations.

## Files

- `SKILL.md`: agent metadata and central decision workflow.
- `references/video-playbook.md`: detailed storyboard and video-render guidelines.
- `assets/interactive-starter.html`: standalone HTML starter with a working slider and reset button.

The skill tells the agent what to make. Actual generation or rendering depends on the model's tools and environment. It does not provide API credentials, a video-rendering engine, or a deployed web server.

References: [Agent Skills specification](https://agentskills.io/specification), [OpenAI skill authoring docs](https://learn.chatgpt.com/docs/build-skills).
