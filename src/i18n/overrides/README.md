# Translation Overrides

These files contain **human corrections** to AI-generated translations.

## How to fix a translation

1. Find the key in `../generated/{lang}.json`
2. Add **only the corrected key** to this file
3. Submit a PR

## Example

To fix the German hero headline, edit `de.json`:

```json
{
  "hero": {
    "headline": "Corrected German headline here"
  }
}
```

## Why this works

- AI regenerates `generated/*.json` when English changes
- Your corrections here are **merged on top** at build time
- Only include keys you're fixing - not the whole file

## Full guide

See [docs/TRANSLATION_GUIDE.md](../../../docs/TRANSLATION_GUIDE.md)
