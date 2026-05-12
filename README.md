# setup-manifest-merger

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

# Build the project (TypeScript type checking)
npm run build

# Package the project (bundle with ncc)
npm run package

# Build and package in one command
npm run all
```

Always commit the `dist/` folder — GitHub Actions runs the compiled bundle directly.

---

## License

This project is licensed under the [MIT License](LICENSE).