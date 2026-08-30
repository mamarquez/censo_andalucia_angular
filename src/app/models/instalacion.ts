import {Provincia} from './provincia';
import {Municipio} from './municipio';
import {InstalacionTelefono} from './instalaciontelefono';
import {Gestor} from './gestor';

/**
 * Espejo del DTO `InstalacionRecord` del backend.
 *
 * <p>El backend serializa casi todo en camelCase; solo `xy_x`, `xy_y`, `xy_z` y
 * `referencia_catastral` llevan `@JsonProperty` en snake_case.</p>
 */
export class Instalacion {
    id!: number;
    codigo!: string;
    nombre!: string;
    nombrePopular?: string;
    provincia!: Provincia;
    comunidad?: { id: number; codigo?: string; nombre: string; descripcion?: string; activo?: boolean };
    municipio!: Municipio;
    direccion?: string;
    cp!: string;
    telefonos?: InstalacionTelefono[];
    fax?: string;
    email?: string;
    web?: string;
    gestor?: Gestor;
    visible?: boolean = false;
    observaciones?: string;
    baja?: boolean = false;
    motivoBaja?: string;
    gradosLatitud?: string;
    minutosLatitud?: string;
    segundosLatitud?: string;
    gradosLongitud?: string;
    minutosLongitud?: string;
    segundosLongitud?: string;
    altitud?: string;
    nmeaLatitud?: string;
    nmeaLongitud?: string;
    utmX?: string;
    utmY?: string;
    utmHuso?: string;
    utmBanda?: string;
    xy_x?: string;
    xy_y?: string;
    xy_z?: string;
    referencia_catastral?: string;

  // Configuración de validaciones
  public static readonly campos = {
    nombre: { maxLength: 50 }
  };
}
