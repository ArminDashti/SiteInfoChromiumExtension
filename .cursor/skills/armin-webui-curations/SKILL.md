---
name: armin-webui-curations
description: >-
  Armin WebUI standards, curations, and design-language extraction. Use when
  building or reviewing WebUI pages, applying approved design fixes or a chosen
  design alternative, laying out forms (label+field on one line, width on inputs
  not labels), About Me / identity pages, aligning UI with shared tokens and
  sibling-page patterns, or capturing project UI standards (footer, grids,
  login-ui, sidebar-menu, theme). Also use to extract the design language of a
  website URL (colors, fonts, spacing, tokens, Tailwind/shadcn/Figma themes,
  WCAG score) when the user says 'extract design', 'get design system',
  'design language', 'design tokens', 'what colors/fonts does this site use',
  or '/extract-design'.
disable-model-invocation: false
metadata:
  version: 2.0.0
  author: "Armin Dashti"
  category: webui
  tags: [webui, design, forms, design-tokens, design-system, about-me, standards, curations]
  last_updated: "2026-10-09 17:33:09"
  uuid: 85159c7b-e318-458f-928d-08465bd037a9
---

# Armin WebUI curations

## When to use

- Building, reviewing, or restyling WebUI pages
- Applying an **approved** design spec or chosen design alternative
- Form layout and field-width tweaks
- About Me / identity pages
- Extracting a site's design language / tokens from a URL
- Merges former: `webui-principles`, `armin-ui-to-principle`, `armin-webui-principles`, `armin-principles-webui`, `webui-add-best-practices-by-armin`

## Topics

Read only the file(s) that match the task.

| Topic | File |
|-------|------|
| Apply approved design fixes | [guides/apply-design-fixes.md](guides/apply-design-fixes.md) |
| Extract design language from a URL (`designlang`) | [guides/extract-design-language.md](guides/extract-design-language.md) |
| About Me / identity page | [standards/about-armin/description.md](standards/about-armin/description.md) (portrait `standards/about-armin/armin.png`) |
| Theme reference image | `standards/theme/color.png` (dark-theme app screenshot) |
| Footer, grids, login-ui, sidebar-menu | `standards/<name>/` (placeholders, no content yet) |

## Hard rules

1. Prefer shared components, design tokens, and sibling-page patterns over one-offs.
2. Discover paths in the active workspace — do not assume a fixed framework.
3. Do not invent design fixes; only apply what the user approved or this skill mandates.
4. No unapproved database writes (`INSERT` / `UPDATE` / `DELETE`).
5. Verify live pages only with the Cursor built-in IDE browser (`cursor-ide-browser`) — never the user's personal browser or other browser automations that interrupt their session.
6. Explicit user instructions for this task win for that task only.

## Form layout (always)

1. Keep each **label and its TextBox/DropDown on the same line** — never label alone on one line and control on the next.
2. When the user names fields by label text and asks to change width, change the associated **input/TextBox `Width`**, not `CustomLabel` / label width, unless they explicitly say label.
3. Prefer purpose-colored dense filter sections when that matches project user preferences (e.g. Taraz pattern / `webpageui-standard.md` → User preferences).

## Identity / About Me

Follow [standards/about-armin/description.md](standards/about-armin/description.md):

- Tagline, three bio beats, Interests, obfuscated contact, English + Persian quotes
- Portrait: `standards/about-armin/armin.png` → app `public/about-me/armin.png`
- Never put a contiguous plaintext email in static markup

## Standards stubs

`standards/footer`, `standards/grids`, `standards/login-ui`, `standards/sidebar-menu`, `standards/theme` are reserved for project UI standards — fill them as patterns are captured; do not invent conflicting systems.

## Do not

- Expand beyond the approved design spec
- Interrupt the user's desktop browsing session
- Skip form same-line label+control rules
