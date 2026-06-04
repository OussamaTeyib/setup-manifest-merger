# AGENTS.md

> Guidance for AI agents (e.g. Copilot, Antigravity, Cursor, Claude) working in this repository.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Layout](#2-repository-layout)
3. [Build System](#3-build-system)
4. [Coding Standards](#4-coding-standards)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Important Constraints](#6-important-constraints)

---

## 1. Project Overview

**setup-manifest-merger** is a GitHub Action that downloads Android Manifest Merger from GitHub releases and adds it to PATH. By default, it automatically fetches the latest release; users can optionally pin a specific version.

| Property     | Value           |
| ------------ | ------------=---|
| Language     | TypeScript      |
| Build system | npm / tsc / ncc |
| Runtime      | Node.js 24      |
| Version      | 1.0.2           |
| License      | MIT             |

---

## 2. Repository Layout

```plaintext
setup-manifest-merger/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug report & feature request templates
│   ├── workflows/
│   │   ├── build.yml          # CI: build and validate dist/
│   │   ├── release.yml        # CD: create GitHub releases
|   |   ├── codeql.yml         # CI: Run static analysis
│   │   └── test.yml           # Test the action on multiple platforms
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── pull_request_template.md
│   └── SECURITY.md
├── src/                      # TypeScript source code
├── dist/                     # Compiled JavaScript bundle (committed)
├── .gitignore
├── .gitattributes
├── action.yml                # GitHub Action metadata
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── tsconfig.json             # TypeScript configuration
├── renovate.json             # Dependency update automation
├── LICENSE
├── README.md
└── AGENTS.md
```

---

## 3. Build System

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | >=24    |
| npm     |         |

### npm scripts

```bash
# Install dependencies
npm install

# Build the project (TypeScript type checking)
npm run build

# Package the project (bundle with ncc)
npm run package

# Build and package in one command
npm run all

# Watch mode for development
npm run dev

# Lint the code
npm run lint

# Format the code
npm run format
```

### Build process

The build process uses:

- **TypeScript** for type checking (`npm run build`)
- **ncc** (Next.js Compiler) to compile and bundle `src/main.ts` into a single `dist/index.js` file
- The `dist/` folder must be committed as GitHub Actions runs the compiled bundle directly

Use `npm run build` for type checking only, `npm run package` for compilation and bundling, or `npm run all` for both steps.

### Dependencies

- **Runtime dependencies**: `@actions/core`, `@actions/exec`, `@actions/io`, `@actions/tool-cache`
- **Dev dependencies**: `@types/node`, `@vercel/ncc`, `typescript`

---

## 4. Coding Standards

### TypeScript code (`src/`)

- **Style**: Follow official TypeScript style and ESLint rules
- Use `async/await` for asynchronous operations
- Handle errors properly with try/catch blocks
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### Configuration files

- Use JSON for configuration files where possible
- Follow standard naming conventions

### Git

- Always commit the `dist/` folder after building
- Use conventional commit messages

---

## 5. CI/CD Pipeline

All workflows are defined in `.github/workflows/`.

### `build.yml` — triggered on

- Push to `main`
- Push of a `v*.*.*` tag
- Pull requests targeting `main`
- Manual dispatch

**Steps summary:**

1. Check out code.
2. Set up Node.js 24.
3. Install dependencies.
4. Build the project.
5. Ensure `dist/` is up to date (fails if not committed).

### `test.yml` — triggered on

- Push to `main`
- Push of a `v*.*.*` tag
- Pull requests targeting `main`
- Manual dispatch

**Steps summary:**

1. Check out code.
2. Test the action on Ubuntu, macOS, and Windows.
3. Install AAPT2 with default and pinned versions.
4. Verify `manifest-merger` works.

### `release.yml` — triggered on version tag push

Creates a GitHub Release with generated release notes.

### `codeql.yml` — triggered on

- Push to `main`
- Push of a `v*.*.*` tag
- Pull requests targeting `main`
- Manual dispatch

Runs GitHub's CodeQL static analysis on `javascript-typescript`.

---

## 6. Important Constraints

| Rule                                      | Reason                                                                |
| ----------------------------------------- | --------------------------------------------------------------------- |
| **Always commit `dist/` after building.** | GitHub Actions runs the compiled bundle directly from the repository. |
| **Test on multiple platforms.**           | The action must work on Ubuntu, macOS, and Windows runners.           |
