import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FrontendRoutes as routes } from '@quma/config';

const frontendRoutes = {};
console.log(routes);
for (const key in routes) {
  const route = routes[key];
  frontendRoutes[key] = {
    path: route.path,
    method: route.method,
  };
}

const outputPath = path.join(process.cwd(), './src/FrontendRoutes.ts');

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
