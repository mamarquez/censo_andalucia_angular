import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../environments/environment';
import { Provincia } from '../models/provincia';
import { buildHttpParams } from '../utils/params.util';
import { ApiResponse } from '../models/apiresponse';
import {Cerramiento} from '../models/cerramiento';
import {Configuracion} from '../models/configuracion';
import {Municipio} from '../models/municipio';
import {ActividadDeportiva} from '../models/actividaddeportiva';
import {Filtros} from '../filtros/filtros';
import {Instalacion} from '../models/instalacion';

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
  numeroInstalaciones() {
    return this.http.get<ApiResponse<number>>(`${this.api}/instalaciones/contador`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroEspaciosDeportivos() {
    return this.http.get<ApiResponse<number>>(`${this.api}/instalaciones/espaciosdeportivos`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroEspaciosComplementarios() {
    return this.http.get<ApiResponse<number>>(`${this.api}/instalaciones/contador`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroModalidadesDeportivas() {
    return this.http.get<ApiResponse<number>>(`${this.api}/instalaciones/contador`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroActividadesDeportivas() {
    return this.http.get<ApiResponse<number>>(`${this.api}/actividadesdeportivas/contador`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
  }

  numeroRutas() {
    return this.http.get<ApiResponse<number>>(`${this.api}/instalaciones/contador`, {
      params: buildHttpParams(this.filtros), headers: this.headers
    });
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

  cargarActividadesDeportivas() {
    return this.http.get<ApiResponse<ActividadDeportiva[]>>(`${this.api}/actividadesdeportivas`, {
      params: buildHttpParams(this.filtros), headers: this.headers
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

}
