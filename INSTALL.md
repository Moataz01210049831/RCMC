## 1. System requirements

| Tool | Required version | Download |
|------|------------------|----------|
| **Node.js** | `22.11.0` (LTS) | https://nodejs.org/en/download |
| **npm** | `10.9.0` (ships with Node 22.11.0) | bundled with Node |
| **Angular CLI** (global, optional) | `20.2.2` | `npm install -g @angular/cli@20.2.2` |


## 2. Runtime dependencies

Installed automatically by `npm install`. Fetched from `https://registry.npmjs.org/`.

| Package | Version | Purpose | Link |
|---------|---------|---------|------|
| `@angular/animations` | `20.2.0` | Angular animations | https://www.npmjs.com/package/@angular/animations |
| `@angular/common` | `20.2.0` | Common directives/pipes | https://www.npmjs.com/package/@angular/common |
| `@angular/compiler` | `20.2.0` | JIT compiler | https://www.npmjs.com/package/@angular/compiler |
| `@angular/core` | `20.2.0` | Core framework | https://www.npmjs.com/package/@angular/core |
| `@angular/forms` | `20.2.0` | Forms module | https://www.npmjs.com/package/@angular/forms |
| `@angular/platform-browser` | `20.2.0` | Browser platform | https://www.npmjs.com/package/@angular/platform-browser |
| `@angular/router` | `20.2.0` | Router | https://www.npmjs.com/package/@angular/router |
| `@ngx-translate/core` | `17.0.0` | i18n (ar/en) | https://www.npmjs.com/package/@ngx-translate/core |
| `@ngx-translate/http-loader` | `17.0.0` | i18n JSON loader | https://www.npmjs.com/package/@ngx-translate/http-loader |
| `ngx-toastr` | `20.0.5` | Toast notifications | https://www.npmjs.com/package/ngx-toastr |
| `rxjs` | `7.8.0` | Reactive streams | https://www.npmjs.com/package/rxjs |
| `tslib` | `2.3.0` | TypeScript runtime helpers | https://www.npmjs.com/package/tslib |
| `zone.js` | `0.15.0` | Change-detection zones | https://www.npmjs.com/package/zone.js |

## 3. Build & test dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/build` | `20.2.2` | esbuild-based builder |
| `@angular/cli` | `20.2.2` | `ng` CLI |
| `@angular/compiler-cli` | `20.2.0` | AOT compiler |
| `@types/jasmine` | `5.1.0` | Test type definitions |
| `jasmine-core` | `5.9.0` | Test framework |
| `karma` | `6.4.0` | Test runner |
| `karma-chrome-launcher` | `3.2.0` | Chrome launcher for tests |
| `karma-coverage` | `2.2.0` | Coverage reports |
| `karma-jasmine` | `5.1.0` | Karma–Jasmine bridge |
| `karma-jasmine-html-reporter` | `2.1.0` | HTML test reports |
| `typescript` | `5.9.2` | TypeScript compiler |

## 5. Available npm scripts

| Script | What it does |
|--------|--------------|
| `npm start` | Dev server on http://localhost:4200 |
| `npm run start:local` | Dev server with `development` configuration |
| `npm run start:prod` | Dev server pointed at the live API |
| `npm run build` | Default build |
| `npm run build:prod` | Production build → `dist/rcmc-new/` |
| `npm run watch` | Dev build in watch mode |
| `npm run test` | Run Karma/Jasmine tests |
