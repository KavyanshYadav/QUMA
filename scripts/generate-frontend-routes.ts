import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { routes } from '../packages/quma_config/dist/index.js';

const frontendRoutes: Record<string, { path: string; method: string }> = {};

for (const key in routes) {
  const route = routes[key as keyof typeof routes];
  frontendRoutes[key] = {
    path: route.path,
    method: route.method,
  };
}

const outputPath = path.join(
  process.cwd(),
  'packages/qumaconfigShared/src/FrontendRoutes.ts'
);

const fileContent = `
export const FrontendRoutes = ${JSON.stringify(
  frontendRoutes,
  null,
  2
)} as const;

export type FrontendRouteKey = keyof typeof FrontendRoutes;
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`✅ Frontend routes generated at ${outputPath}`);
