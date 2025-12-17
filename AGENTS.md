# Agent Guidelines

## Commands

- **Build**: `tsc -b && vite build`
- **Lint**: `biome check .`
- **Format**: `biome format --write .`
- **Dev server**: `vite`
- **Type check**: `tsc -b`
- **Package Manager**: bun

## Code Style

- **TypeScript**: Strict mode enabled, no unused locals/parameters
- **Formatting**: Tabs, double quotes, auto-organized imports
- **Filenames**: kebab-case for components and files (e.g., dialogue-box.tsx)
- **Components**: Arrow functions, explicit TypeScript interfaces
- **Imports**: Relative paths, double quotes (React hooks like `useEffect`, `useState` are auto-imported via unplugin-auto-import)
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **Error handling**: Try/catch with console.error, proper useEffect cleanup
- **Naming**: camelCase for variables/functions, PascalCase for components
- **React**: Functional components, hooks, no default exports for components
