# Pendientes

- [ ] Ruta `resultados-busqueda` comentada en `app.routes.ts` a falta de crear el componente (ver `InstalacionesComponent.buscar()`, que no tiene lógica implementada).
- [ ] `WidgetComponent`: resolver URL real del iframe del mapa (actualmente `xxxxxxx/...`).
- [ ] Corregir los 49 errores detectados por `npm run lint` (uso de `any`, `inject()` vs constructor, tipos inferibles, import sin usar).
- [ ] Revisar contadores duplicados/erróneos en `CensoService` y `ContadorComponent` (ver bugs.md).
- [ ] **Galería de imágenes de instalación** (`views/instalacion/galeria/`): completar `GaleroaInstalacionComponent.cargarGaleria()` (llamada real a `CensoService`, sin implementar), reemplazar el template placeholder, y renombrar la clase (typo: `GaleroaInstalacionComponent` → `GaleriaInstalacionComponent`). Bloqueado en parte por el backend: `InstalacionImagenRecord` aún no expone la URL del binario (ver `PENDIENTES.md` del backend `instalaciones-api`).
