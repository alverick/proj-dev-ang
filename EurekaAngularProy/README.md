# EurekaAngularProy

This project is used for to company clients to manage their debts and payments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Server](#development-server)
- [Webpack custom configuration](#webpack-custom-configuration)
- [Transform html index configuration](#transform-html-index-configuration)
- [Manage environment files](#manage-environment-files)
- [Build](#build)
- [Code scaffolding](#code-scaffolding)
- [Running Unit Tests](#running-unit-tests)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher) or [Yarn](https://yarnpkg.com/) (v1.22 or higher)
- [Angular CLI](https://angular.io/cli) (v17 or higher)

To install Angular CLI globally, run:

```bash
  npm install -g @angular/cli
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://<username>@bitbucket.org/ibkteam/eureca-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd eureca-frontend/EurekaAngularProy
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or if using Yarn:

   ```bash
   yarn install
   ```

## Development server

Run the development server using the following command:

```bash
  npm run start
```

Navigate to http://localhost:4200/ in your browser. The application will automatically reload if you change any of the source files.

### HMR mode

To run the development server in Hot Module Replacement (HMR) mode, use the following command:

```bash
  npm run start:hmr
```

### Storybook

To run Storybook, use the following command:

```bash
  npm run storybook
```

### Compodoc

To run Compodoc, use the following command:

```bash
  npm run compodoc:build-and-serve
```

## Webpack custom configuration

This project uses **@angular-builders/custom-webpack** to modify Webpack settings. The path to the custom Webpack configuration file is specified in **angular.json** as **config/extra-webpack.config.js**.

Two configurations have been added. The first is **WebpackBuildNotifierPlugin**, which emits a notification when the build is finished.

The second is the **sass-resources-loader**, which preloads global variables and mixins in SCSS files.

## Transform html index configuration

This project uses @angular-builders/custom-webpack to dynamically modify the index.html file during the build process. The custom Webpack configuration is specified in angular.json under src/index-html.transform.ts.

Schema for environment configuration

```typescript
type EnvironmentConfig = {
  scripts: {
    // Paths for JavaScript files to be inserted during the build process
    hotjar: string; // Hotjar script
    newRelic: string; // New Relic script
  };
  url: string; // Domain URL for the environment
};
```
The following functions are used to transform index.html dynamically during the build process:

- **replaceDomainUrl:** Replaces the domain URL in index.html, ensuring the correct environment-specific assets are preloaded.
- **includeScripts:** Dynamically inserts script files defined in the scripts object of EnvironmentConfig during the build process.

This approach ensures that the application loads the appropriate assets and configurations based on the environment.

## Code scaffolding

Run the following command to generate a new component, directive, pipe, service, class, guard, interface, enum, or module:

```bash
ng generate component component-name
```

Also if you want generate other type of elements you can see the generate documentation in the next link [Angular CLI generate](https://angular.io/cli/generate)

For to generate page components you can use the following command:

```bash
ng generate component src/app/features/<module-folder>/pages/page-name --type=page
```

## Manage environment files

This project use the angular environment system to manage the different environment variables. The environment files are located in the **src/environments** directory.

The files use this following schema

```typescript
export interface IEnvironment {
  production: boolean; 
  development: boolean;
  hmr: boolean;
  END_POINT: string;
  OCP_KEY: string;
  logLevel: number;
  serverLogLevel: number;
  credentials: string[][];
  adobe: string;
}
```

## Build

For to build the project you can use the following command:

```bash
npm run build -- --configuration <enviroment>
```

where enviroment is the enviroment that you want to build the project, for example:

```bash
npm run build -- --configuration dev
```

the environments options are dev, uat, production.

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

## Project Structure

The project is structured as follows:

```
EurekaAngularProy/
├── config/                       # Webpack extra configuration files
├── devops/                       # Pipelines for deployment to environment
├── fonts/                        # Custom fonts files
├── libs/                         # Shared libraries for building the project
├── src/
│   ├── app/
│   │   ├── features/             # Feature modules
│   │   │   ├── admin/            # Admin module
│   │   │   ├── auth/             # Auth module
│   │   │   ├── internal/         # Internal module
│   │   │   └── public/           # Public module
│   │   ├── shared/               # Shared components
│   │   ├── store/                # NgRx store
│   │   ├── app.component.ts      # Root component
│   │   ├── app.module.ts         # Root module
│   │   ├── app-routing.module.ts # Routing configuration
│   │   └── app-routing.names.ts  # Routing names definition
│   ├── assets/                   # Static assets (images, fonts, etc.)
│   ├── environments/             # Environment configurations
│   ├── mocks/                    # Mock data for testing
│   ├── scss/                     # Global styles
│   ├── stories/                  # Storybook example stories
│   ├── hmr.ts                    # HMR setup file
│   ├── index.html                # HTML template
│   ├── index-html.transformer.ts # Config for transforming index.html by webpack
│   ├── main.ts                   # Entry file
│   ├── mockServiceWorker.js      # MSW service worker
│   └── tsconfig.app.json         # TypeScript configuration for the app
├── .storybook/                   # Storybook configuration
├── .editorconfig                 # Editor configuration
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .stylelintrc.json             # Stylelint configuration
├── angular.json                  # Angular CLI configuration
├── jest.config.js                # Jest configuration
├── package.json                  # Project dependencies
├── package-lock.json             # Lock file for npm
├── postcss.config.js             # PostCSS configuration
├── setup-jest.ts                 # Jest setup file
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.doc.json             # TypeScript configuration for compodoc documentation
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.spec.json            # TypeScript configuration for tests
└── README.md                     # Project documentation
```

## Technologies Used

- [Angular 17](https://angular.io) - Frontend framework
- [TypeScript](https://www.typescriptlang.org) - Primary programming language
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [RxJS](https://rxjs.dev) - Reactive programming library
- [SCSS](https://sass-lang.com) - CSS preprocessor
- [Jest](https://jestjs.io) - Testing framework
- [Storybook 8](https://storybook.js.org) - UI component explorer
- [Compodoc](https://compodoc.app) - Documentation generator
- [NgRx](https://ngrx.io) - State management library
- [PrimeNG 17](https://primeng.org) - UI component library
- [EsLint](https://eslint.org) - Linter tool
- [Prettier](https://prettier.io) - Code formatter
- [MSW (Mock Service Worker)](https://mswjs.io) - API mocking library

