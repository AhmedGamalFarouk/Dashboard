# Dashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## Development server

To start a local development server, run:
# Dashboard

A lightweight Angular dashboard application. This repository contains the source for a simple admin-style dashboard built with Angular.

**Quick overview:**
- **Framework:** Angular
- **Purpose:** Demo/admin dashboard UI and employee model/service examples

**Prerequisites:**
- Node.js (recommended LTS version, e.g., 16+)
- npm (comes with Node.js)
- Angular CLI (optional, used for local CLI commands)

## Setup

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm start
# or
ng serve --open
```

Open your browser at `http://localhost:4200/`. The app will reload on source changes.

## Scripts
- `npm start` — runs the dev server (uses Angular CLI `ng serve`).
- `npm test` — runs unit tests.
- `ng build` — compiles the app into the `dist/` folder for production.

Replace or extend scripts in `package.json` as needed for your workflow.

## Project structure (important files)
- `src/main.ts` — application bootstrap
- `src/index.html` — main HTML file
- `src/styles.css` — global styles
- `src/app/app.ts` — app entry
- `src/app/app.routes.ts` — routing configuration
- `src/app/components/dashboard/` — dashboard component
- `src/app/services/employee.service.ts` — example service for employee data
- `src/app/models/employee.model.ts` — employee model definition

## Testing

Run unit tests:

```powershell
npm test
```

E2E test setup is not included by default — choose a framework (Protractor, Cypress, Playwright) and add configuration if needed.

## Contributing
- Create a branch per feature or bugfix.
- Follow consistent commit messages and open a pull request for review.

## Troubleshooting
- If `ng` is not found, run `npx ng <command>` or install the Angular CLI globally with `npm i -g @angular/cli`.
- If the dev server fails to start, check for port conflicts or missing dependencies and run `npm install` again.

## License
Specify a license for the project (e.g., MIT) or add one to `LICENSE`.

For full Angular CLI docs and commands, see: https://angular.dev/cli
