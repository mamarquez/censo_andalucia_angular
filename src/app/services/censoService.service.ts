import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../environments/environment';
import { Provincia } from '../models/provincia';
import { buildHttpParams } from '../utils/params.util';
import { ApiResponse } from '../models/apiresponse';
import { Cerramiento } from '../models/cerramiento';
import { NivelDotacion } from '../models/niveldotacion';
import { Configuracion } from '../models/configuracion';
import { Municipio } from '../models/municipio';
import { ActividadDeportiva } from '../models/actividaddeportiva';
import { Filtros } from '../filtros/filtros';
import { Instalacion } from '../models/instalacion';
import { InstalacionImagen } from '../models/instalacion-imagen';
import { InstalacionRuta } from '../models/instalacion-ruta';
import { InstalacionRutaCoordenada } from '../models/instalacion-ruta-coordenada';
import { InstalacionEspacioDeportivo } from '../models/instalacion-espacio-deportivo';

@Injectable({
  providedIn: 'root'
})
export class CensoService {
  mostrarContadores = signal(true);
  menuAbierto = signal(false);
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}`;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  filtros: Filtros = {
    activo: true
  };

  /**
   * Contadores
   */
  private contador(ruta: string) {
    return this.http.get<ApiResponse<number>>(`${this.api}/${ruta}`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroInstalaciones() {
    return this.contador('instalaciones/contador');
  }

  numeroEspaciosDeportivos() {
    return this.contador('instalaciones/espaciosdeportivos');
  }

  numeroEspaciosComplementarios() {
    return this.contador('instalaciones/contador');
  }

  numeroModalidadesDeportivas() {
    return this.contador('instalaciones/contador');
  }

  numeroActividadesDeportivas() {
    return this.contador('actividadesdeportivas/contador');
  }

  numeroRutas() {
    return this.contador('instalaciones/contador');
  }


  cargarProvincias(filtros: Filtros = this.filtros) {
    this.filtros.nombre = '';
    return this.http.get<ApiResponse<Provincia[]>>(`${this.api}/provincias`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  cargarMunicipios(filtros: Filtros = this.filtros) {
    return this.http.get<ApiResponse<Municipio[]>>(`${this.api}/municipios`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  cargarCerramientos() {
    return this.http.get<ApiResponse<Cerramiento[]>>(`${this.api}/cerramientos`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  cargarMedidas() {
    return this.http.get<ApiResponse<Provincia[]>>(`${this.api}/medidas`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  cargarActividadesDeportivas(filtros: Filtros = this.filtros) {
    return this.http.get<ApiResponse<ActividadDeportiva[]>>(`${this.api}/actividadesdeportivas`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  cargarNivelesDotacion(filtros: Filtros = this.filtros) {
    return this.http.get<ApiResponse<NivelDotacion[]>>(`${this.api}/nivelesdotaciones`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  /**
   * Obtener espacios deportivos de instalaciones.
   * <p>
   * El backend no permite filtrar por instalación (solo por `id`, `codigo` y `visible`),
   * así que se obtiene el listado completo de visibles y se filtra por `idInstalacion`
   * en el cliente.
   */
  cargarInstalacionesDeportivas(id: number) {
    return this.http.get<ApiResponse<InstalacionEspacioDeportivo[]>>(`${this.api}/instalacionesespaciosdeportivos`, {
      params: buildHttpParams({ id, visible: true }), headers: this.headers
    });
  }


  /**
   * Para cargar configuraciones
   */
  cargarConfiguraciones(filtros: Filtros = this.filtros) {
    return this.http.get<ApiResponse<Configuracion[]>>(`${this.api}/configuraciones`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  /**
   * Obtener instalaciones
   * @param filtros
   */
  cargarInstalaciones(filtros: Filtros = this.filtros) {
    return this.http.get<ApiResponse<Instalacion[]>>(`${this.api}/instalaciones`, {
      params: buildHttpParams(filtros), headers: this.headers
    });
  }

  /**
   * Obtener instalacion por su id
   * @param id Id de la instalacion
   */
  cargarInstalacion(id: string) {
    return this.http.get<ApiResponse<Instalacion>>(`${this.api}/instalaciones/${id}`, {
      headers: this.headers
    });
  }

  /**
   * Obtener lista de imagenes de instalacion
   * @param id Id de la instalacion
   * @returns 
   */
  cargarImagen(id: number) {
    return this.http.get<ApiResponse<InstalacionImagen[]>>(`${this.api}/instalacionesgaleria/${id}`, {
      headers: this.headers
    });
  }

  /**
   * Obtener lista de rutas de una instalación
   * @param idInstalacion Id de la instalacion
   */
  cargarRutas(idInstalacion: number) {
    return this.http.get<ApiResponse<InstalacionRuta[]>>(`${this.api}/instalacionesrutas`, {
      params: buildHttpParams({ idInstalacion, visible: true }),
      headers: this.headers
    });
  }

  /**
   * Obtener lista de coordenadas (puntos del trazado) de una ruta
   * @param idRuta Id de la ruta
   */
  cargarCoordenadasRuta(idRuta: number) {
    return this.http.get<ApiResponse<InstalacionRutaCoordenada[]>>(`${this.api}/instalacionesrutascoordenadas`, {
      params: buildHttpParams({ idRuta }),
      headers: this.headers
    });
  }

  exportarInstalacionesExcel(filtros: Filtros = this.filtros) {
    return this.http.get(`${this.api}/listados`, {
      params: buildHttpParams(filtros),
      responseType: 'blob'
    });
  }

}
