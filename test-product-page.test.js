const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const routesPath = path.join(__dirname, 'routes', 'views.routes.js');
const routesContent = fs.readFileSync(routesPath, 'utf8');

assert.match(routesContent, /router\.get\(['"]\/admin\/productos\/nuevo['"]/m, 'Debe existir la ruta para crear un producto desde su propia página');
assert.match(routesContent, /router\.get\(['"]\/admin\/productos\/:id\/editar['"]/m, 'Debe existir la ruta para editar un producto desde su propia página');

console.log('OK: rutas de admin de productos configuradas.');
