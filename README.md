# setup-manifest-merger

[![Build](https://github.com/OussamaTeyib/setup-manifest-merger/actions/workflows/build.yml/badge.svg)](https://github.com/OussamaTeyib/setup-manifest-merger/actions/workflows/build.yml)
[![Test](https://github.com/OussamaTeyib/setup-manifest-merger/actions/workflows/test.yml/badge.svg)](https://github.com/OussamaTeyib/setup-manifest-merger/actions/workflows/test.yml)

A GitHub Action that downloads [Android Manifest Merger by distriqt](https://github.com/distriqt/android-manifest-merger) from GitHub releases and adds a `manifest-merger` launcher to `PATH`.

---

## Usage

**Basic** (automatically uses the latest GitHub release):

```yaml
- name: Set up Android Manifest Merger
  uses: OussamaTeyib/setup-manifest-merger@v1
```

**With a pinned version**:

```yaml
- name: Set up Android Manifest Merger
  uses: OussamaTeyib/setup-manifest-merger@v1
  with:
    version: '31.9.0'
```

---

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Package the project
npm run package

# Build and package in one command
npm run all
```

Always commit the `dist/` folder — GitHub Actions runs the compiled bundle directly.

---

## License

This project is licensed under the [MIT License](LICENSE).
