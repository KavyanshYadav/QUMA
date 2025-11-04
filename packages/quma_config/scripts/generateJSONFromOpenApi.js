import fs from 'fs';
import path from 'path';
import { routes } from '../dist/index.js';

const EditedRoutes = {};

function cleanEntry(obj, keysToRemove = []) {
  const cleaned = { ...obj }; // shallow copy
  for (const key of keysToRemove) {
    delete cleaned[key];
  }
  return cleaned;
}

for (const [route, routeData] of Object.entries(routes)) {
  EditedRoutes[routes[route].path] = cleanEntry(routeData, [
    'schemas',
    'responses',
  ]);
}

const outputPath = path.join('dist', 'openapiflatten.json');
fs.writeFileSync(outputPath, JSON.stringify(EditedRoutes, null, 2));

console.log(`✅ Flattened routes written to ${outputPath}`);
