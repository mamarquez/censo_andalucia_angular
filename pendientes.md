# Pendientes

- [ ] Ruta `resultados-busqueda` comentada en `app.routes.ts` a falta de crear el componente (ver `InstalacionesComponent.buscar()`, que no tiene lógica implementada).
- [ ] `WidgetComponent`: resolver URL real del iframe del mapa (actualmente `xxxxxxx/...`).
- [x] Añadir `environment.prod.ts` y configurar `fileReplacements` para build de producción. → Creado apuntando a `http://instalaciones.ddns.net/api-instalaciones/v1` (revisar/actualizar URL cuando se confirme el dominio definitivo, sobre todo pasar a HTTPS).
- [x] Registrar `provideHttpClient()` en `app.config.ts`.
- [x] Sin tests: no existen specs ni `tsconfig.spec.json`. → Quitada la referencia en `tsconfig.json`.
- [x] Sin lint configurado (no hay script `lint` en `package.json`). → Añadido `angular-eslint` (`npm run lint`).
- [ ] Corregir los 49 errores detectados por `npm run lint` (uso de `any`, `inject()` vs constructor, tipos inferibles, import sin usar).
- [ ] Revisar contadores duplicados/erróneos en `CensoService` y `ContadorComponent` (ver bugs.md).
