export interface Filtros {
  id?: number | null;
  nombre?: string | null;
  valor?: string | null;
  baja?: boolean | null;
  activo?: boolean | null;
  cpro?: string | null;
  /** Id de provincia. Se serializa como `provincia` para el backend (FiltroInstalacionRequest.provincia). */
  provincia?: number | null;
  /** Id de municipio. Se serializa como `municipio` para el backend. */
  municipio?: number | null;
  /** Id de provincia para filtrar municipios (FiltroMunicipioRequest.idProvincia en /municipios). */
  idProvincia?: number | null;
  /** Id de deporte / actividad deportiva. El backend aún no lo filtra. */
  deporte?: number | null;
  /** Código de clase de instalación. El backend aún no lo filtra. */
  claseInstalacion?: string | null;
  /** Id de nivel de dotación. El backend aún no lo filtra. */
  nivelDotacion?: number | null;
}
