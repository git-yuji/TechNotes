import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		},
	},
	globalIgnores([
		".next/**",
		".open-next/**",
		"cloudflare-env.d.ts",
		"worker-configuration.d.ts",
	]),
]);

export default eslintConfig;
