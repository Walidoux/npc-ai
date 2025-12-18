# Agent Guidelines

## Commands

- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Format**: `bun run format`
- **Dev server**: `bun run dev`

## Code Style

- **TypeScript**: Strict mode enabled, no unused locals/parameters
- **Formatting**: Tabs, double quotes, auto-organized imports
- **Filenames**: kebab-case for components and files (e.g., dialogue-box.tsx)
- **Components**: Arrow functions, explicit TypeScript interfaces
- **Imports**: Relative paths, double quotes (React hooks like `useEffect`, `useState`, `useRef` are auto-imported via unplugin-auto-import)
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **Error handling**: Try/catch with console.error, proper useEffect cleanup
- **Naming**: camelCase for variables/functions, PascalCase for components
- **React**: Functional components, hooks, no default exports for components
