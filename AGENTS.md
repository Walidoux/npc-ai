# Vite React App Project

This is a Vite SPA project built with React & Typescript. The project uses bun both for as a package manager and for Github Actions workflows.

## External File Loading

CRITICAL: When you encounter a file reference, use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## CLI Commands

- **Build**: `bun run build` - Builds the app
- **Lint**: `bun run lint` - Runs linting using biome toolchain
- **Format**: `bun run format` - Fixes format problems using biome toolchain
- **Dev server**: `bun run dev` - Runs Vite dev server
- **Deploy**: `bun run deploy` - Runs predeploy which builds the app and then the deploys the built app to Github Pages based on the `dist/` generated folder

## Development Guidelines

At the end of every implementation, if there are any linting problems, execute `bun run format`

- **TypeScript**: Strict mode enabled, no unused locals/parameters
- **Formatting**: Tabs, double quotes, auto-organized imports
- **Filenames**: kebab-case for components and files (e.g., dialogue-box.tsx)
- **Components**: Arrow functions, explicit TypeScript interfaces
- **Imports**: Relative paths, double quotes (React hooks like `useEffect`, `useState`, `useRef` are auto-imported via unplugin-auto-import)
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **Error handling**: Try/catch with console.error, proper useEffect cleanup
- **Naming**: camelCase for variables/functions, PascalCase for components
- **React**: Functional components, hooks, no default exports for components, no props drilling.
