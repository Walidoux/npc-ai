import AutoImport from "unplugin-auto-import/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		AutoImport({
			imports: ["react"],
			dts: "src/auto-imports.d.ts",
		}),
	],
	server: { port: 3000 },
});
