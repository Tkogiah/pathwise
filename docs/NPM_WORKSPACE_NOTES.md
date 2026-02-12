# npm Workspace Notes

This repo uses a root `.npmrc` with:

```
if-present=true
include-workspace-root=true
```

Why:

- npm 11 can propagate root scripts into workspaces, which can cause unexpected behavior.
- This config keeps workspace script resolution predictable while allowing clean root scripts (no `npx` prefix).

Keep this file as a quick reminder of why `.npmrc` exists.
