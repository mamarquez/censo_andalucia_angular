# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 21 standalone application for browsing Andalucía's sports facilities census ("Censo de Instalaciones Deportivas de Andalucía"). It's a public-facing site: installation search/listing, per-installation detail pages, an embeddable map widget generator, and static informational pages. Spanish is the language used throughout code (variable/method names), templates, and content — keep new code consistent with that.

## Commands

```bash
npm start          # ng serve — dev server at http://localhost:4200/
ng build            # production build to dist/
ng build --configuration development
npm test            # ng test (Vitest runner via @angular/build:unit-test)
```

There is no e2e test setup and no lint script configured in package.json.

Scaffold new components with the Angular CLI to match existing conventions:
```bash
ng generate component views/<name>   # or layout/<name> for chrome components
```

## Architecture

**Bootstrap**: standalone-component app, no NgModules anywhere. [src/main.ts](src/main.ts) bootstraps [App](src/app/app.ts) with `appConfig` from [app.config.ts](src/app/app.config.ts), which registers the router and PrimeNG (Aura theme). Note: `HttpClient` is injected in services but `provideHttpClient()` is not currently registered in `app.config.ts` — check this if HTTP calls fail at runtime before assuming the service code is wrong.

**Routing**: all routes in [app.routes.ts](src/app/app.routes.ts) use `loadComponent` (lazy, per-route standalone components). Route components live under `src/app/views/<name>/`. Unknown paths redirect to `index`.

**Layout shell**: [App](src/app/app.ts) renders `HeaderComponent`, `MenuComponent`, `ContadorComponent`, `FooterComponent` around `<router-outlet>`. These "chrome" components live in `src/app/layout/<name>/` as opposed to page components in `src/app/views/<name>/`.

**Data layer**: a single `CensoService` ([src/app/services/censoService.service.ts](src/app/services/censoService.service.ts)) is the sole HTTP client for the backend census API (base URL from `environment.apiUrl`, currently `http://localhost:8080/api-instalaciones/v1`). All page/layout components inject this one service directly — there is no per-feature service split. Every method returns an `Observable<ApiResponse<T>>` where `ApiResponse<T>` ([apiresponse.ts](src/app/models/apiresponse.ts)) wraps `{ message, data }`.

**Filtering**: query params for list/counter endpoints are built from a `Filtros` object ([src/app/filtros/filtros.ts](src/app/filtros/filtros.ts): `id`, `nombre`, `valor`, `baja`, `activo`) via `buildHttpParams()` ([src/app/utils/params.util.ts](src/app/utils/params.util.ts)), which drops null/undefined/empty values and serializes everything else to strings. `CensoService.filtros` holds a default/shared filter instance; most calling components construct their own `Filtros` and pass it explicitly instead.

**Models**: plain TypeScript interfaces/classes under `src/app/models/`, one file per domain entity (e.g. `instalacion.ts`, `provincia.ts`, `municipio.ts`, `gestor.ts`, `centroeducativo.ts`, `espaciodeportivo.ts`). These mirror backend DTOs; some (like `Instalacion`) carry static `campos` metadata for validation constraints (e.g. max lengths) alongside the field list.

**Environments**: only `src/app/environments/environment.ts` exists (no `environment.prod.ts` / no `fileReplacements` wired in `angular.json`) — production builds currently use the same (dev-pointed) environment file. Confirm with the user before assuming prod config is separate.

**Change detection**: components generally use manual `ChangeDetectorRef.detectChanges()` after async data loads rather than `OnPush` + signals (default detection strategy; `CensoService.mostrarContadores` is one of the few signals in use).

**Third-party UI**: PrimeNG (Aura theme, Spanish `emptyMessage` override), Bootstrap 5, Font Awesome, and Swiper (initialized via `register()` from `swiper/element/bundle` in components that use carousels, requiring `CUSTOM_ELEMENTS_SCHEMA` on those `@Component` decorators).

## Assistant interaction

- Respond in Spanish by default.
- Use caveman mode (terse, compressed replies) by default.
- MemPalace: local memory tool for this repo, wing `censo_andalucia_angular` (CLI installed at `~/.local/bin/mempalace`, no MCP server wired in `.mcp.json` — use CLI via Bash, not `mempalace_*` tools). Config: `mempalace.yaml` (per-project rooms), `entities.json` (both gitignored).
  - Before answering about past decisions/work in this repo: `mempalace search "<query>" --wing censo_andalucia_angular`.
  - At session start: check daemon (`mempalace daemon status`); if not running, start it (`mempalace daemon start`). Then `mempalace wake-up --wing censo_andalucia_angular` for compressed context.
  - Quote search results verbatim, don't paraphrase. If empty, say so — don't guess.

## Conventions

- Single quotes, 2-space indent, ~100 col width (see [.prettierrc](.prettierrc)); Angular parser for `.html` templates.
- TypeScript strict-ish compiler flags are on: `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictInjectionParameters`, `strictInputAccessModifiers`.
- Component file naming is inconsistent across the codebase: `layout/` and `views/` components use `.component.ts/.html/.css` suffixes, while a few top-level files (`app.ts`, `app.html`, `app.css`) omit it. Match whichever convention the surrounding directory already uses.
