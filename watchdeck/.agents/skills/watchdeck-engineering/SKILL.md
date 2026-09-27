---
name: watchdeck-engineering
description: Implement Watchdeck client-side features safely and incrementally.
---
# Watchdeck Engineering
Preserve the primary loop: open → next → watched. Keep one clear source of truth in IndexedDB. Network errors must not break the user's library. Add data guards for duplicate history/progress. Prefer small browser-native modules over dependency weight unless complexity proves otherwise.
