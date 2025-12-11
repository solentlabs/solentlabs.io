# Solent Labs Website

The official website for [Solent Labs](https://solentlabs.io) - built with Astro and supporting 12 languages.

## Features

- **12 Languages** - EN, DE, NL, FR, ZH, IT, ES, PL, SV, RU, PT-BR, UK
- **AI-Powered Translations** - Claude API generates translations automatically
- **Community Corrections** - Human fixes persist through regeneration
- **Static Site** - Fast, SEO-friendly, deployed to GitHub Pages

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Translation

See [docs/TRANSLATION_GUIDE.md](docs/TRANSLATION_GUIDE.md) for details.

```bash
# Generate all translations (requires ANTHROPIC_API_KEY)
npm run translate

# Check for missing translations
npm run translate:check
```

## Project Structure

```
├── src/
│   ├── i18n/
│   │   ├── en.json           # Source of truth
│   │   ├── generated/        # AI translations
│   │   └── overrides/        # Human corrections
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro       # English homepage
│       └── [locale]/         # Localized pages
├── public/
│   └── assets/               # Images, CSS
├── scripts/
│   └── translate.py          # Translation script
└── docs/
    └── TRANSLATION_GUIDE.md
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview production build |
| `npm run translate` | Generate AI translations |
| `npm run translate:check` | Validate translation completeness |
| `npm run test` | Run Playwright tests |

## Contributing Translations

1. Fork the repository
2. Edit `src/i18n/overrides/{lang}.json` (only keys you're fixing)
3. Submit a PR

Your corrections will persist through future AI regenerations.

## License

MIT

---

A [Solent Labs™](https://solentlabs.io) project.
