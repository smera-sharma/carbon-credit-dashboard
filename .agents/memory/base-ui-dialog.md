---
name: Base UI Dialog quirks
description: Differences between Base UI (used here) and Radix UI for Dialog and Button patterns
---

This project uses Base UI (`@base-ui/react`) NOT Radix UI. Key differences:

**Dialog:**
- No `onInteractOutside` prop — that's Radix-only
- Use `showCloseButton={false}` on `DialogContent` to hide the built-in X button
- Controlled `open` without `onOpenChange` keeps the dialog open (outside clicks fire internally but have no state to change)

**Button:**
- `render={<Link href="..." />}` works for rendering as a Next.js Link
- When using `render` with a non-button element, MUST also pass `nativeButton={false}` or Base UI logs a warning

**Why:** Base UI is the underlying primitive library for the shadcn/ui components in this project. It has a different API surface from Radix despite shadcn/ui traditionally using Radix.
