# Translation Guide

This guide explains how the Solent Labs website handles internationalization (i18n) with AI-assisted translations and community contributions.

## Supported Languages

| Code | Language | Flag |
|------|----------|------|
| en | English (US) | 🇺🇸 |
| de | German | 🇩🇪 |
| nl | Dutch | 🇳🇱 |
| fr | French | 🇫🇷 |
| zh | Chinese (Simplified) | 🇨🇳 |
| it | Italian | 🇮🇹 |
| es | Spanish | 🇪🇸 |
| pl | Polish | 🇵🇱 |
| sv | Swedish | 🇸🇪 |
| ru | Russian | 🇷🇺 |
| pt-br | Portuguese (Brazil) | 🇧🇷 |
| uk | Ukrainian | 🇺🇦 |

Languages are selected based on [Home Assistant user demographics](https://analytics.home-assistant.io/).

## Architecture

```
src/i18n/
├── en.json              # Source of truth (English)
├── index.ts             # Translation loader with merge logic
├── generated/           # AI-generated translations
│   ├── de.json
│   ├── uk.json
│   └── ...
└── overrides/           # Human corrections (sparse)
    ├── de.json          # Only contains corrected keys
    ├── uk.json
    └── ...
```

### How It Works

1. **English is the source** - All content is authored in `en.json`
2. **AI generates translations** - Using Claude Code chat (no API key needed)
3. **Human corrections persist** - Fixes go in `overrides/*.json`
4. **Merge at build time** - `generated + overrides` = final translation

## For Content Authors

### Editing English Content

1. Edit `src/i18n/en.json`
2. Ask Claude Code to regenerate translations for changed content
3. Commit and push

### Adding New Content

Add keys to `en.json` following the existing structure:

```json
{
  "section": {
    "title": "New Section",
    "description": "This will be translated automatically."
  }
}
```

## For Translators

### Correcting a Translation

If you find an error in a translation:

1. Fork the repository
2. Edit the **override file** (not the generated file)
3. Only include the keys you're correcting

**Example**: Fixing the German hero headline

Edit `src/i18n/overrides/de.json`:
```json
{
  "hero": {
    "headline": "Werkzeuge, die verborgene Daten sichtbar machen."
  }
}
```

4. Submit a PR with your correction

### Why Overrides?

- AI regenerates `generated/*.json` when English changes
- Your corrections in `overrides/*.json` are preserved
- Only fix what's wrong - don't copy the whole file

### What NOT to Translate

Keep these terms unchanged:
- Solent Labs / Solent Labs™
- Cable Modem Monitor
- Home Assistant
- DOCSIS
- GitHub
- DRY (Don't Repeat Yourself)
- Open Source

## For Developers

### Generating Translations

Translations are generated using Claude Code chat:

1. Open Claude Code in the project
2. Share the content from `en.json` that changed
3. Ask to generate translations for all 11 languages
4. Claude outputs the updated JSON for each `generated/*.json` file

Example prompt:
```
The hero.headline changed in en.json to "New headline here".
Please generate the translation for this key in all 11 languages
(de, nl, fr, zh, it, es, pl, sv, ru, pt-br, uk).
```

### Validating JSON

```bash
# Check all translation files are valid JSON
for f in src/i18n/generated/*.json; do
  python3 -c "import json; json.load(open('$f'))" && echo "OK: $f"
done
```

## Stale Override Detection

When English content changes, an override might become stale. The build will warn:

```
⚠️  hero.headline changed in English but has override in de.json
    Review and update the override, or delete to use new AI translation
```

## Testing

```bash
# Build and preview
npm run build
npm run preview

# Run Playwright tests
npm run test
```

## Quality Guidelines

### For AI Translations

- Use formal but approachable tone
- Standard technical terminology for the target language
- Preserve formatting and special characters

### For Human Corrections

- Match the existing tone and style
- Use terminology consistent with the tech community
- Test that the JSON is valid before submitting

## Questions?

Open an issue or reach out on [GitHub](https://github.com/solentlabs).
