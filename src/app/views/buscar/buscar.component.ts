import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';
import { Municipio } from '../../models/municipio';
import { ActividadDeportiva } from '../../models/actividaddeportiva';
import { Filtros } from '../../filtros/filtros';
import { OpcionSelect, SelectComponent } from '../../shared/select/select.component';

/**
 * Página de búsqueda avanzada de instalaciones.
 *
 * <p>Replica el formulario del censo original (juntadeandalucia.es/deporte/Censo_Andalucia/buscar):
 * Nombre, Provincia, Zona deportiva, Municipio, Distrito, Clase de instalación, Deporte,
 * Modalidad, Tipo de espacio, Tipo de gestor y Nivel de dotación.</p>
 *
 * <p>Los campos con datos en el backend (Provincia, Municipio, Deporte) se cargan por API;
 * el resto se muestran deshabilitados hasta que exista endpoint. Al enviar navega a
 * <code>/instalaciones</code> con los criterios como query params.</p>
 *
 * @author Duncan
 * @version 1.0.0
 */
@Component({
  standalone: true,
  selector: 'app-buscar',
  imports: [CommonModule, FormsModule, TranslatePipe, SelectComponent],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  constructor(
    private router: Router,
    private censoService: CensoService,
    private cd: ChangeDetectorRef
  ) {}

  /** Opciones de los selects con datos reales del backend. */
  provincias: OpcionSelect[] = [];
  municipios: OpcionSelect[] = [];
  deportes: OpcionSelect[] = [];
  nivelDotacion: OpcionSelect[] = [];

  cargandoMunicipios = false;

  /** Modelo del formulario (strings: los <select> nativos operan con strings). */
  modelo = this.modeloVacio();

  ngOnInit(): void {
    this.censoService.cargarProvincias().subscribe({
      next: (respuesta: ApiResponse<Provincia[]>) => {
        this.provincias = respuesta.data.map(p => ({ valor: p.id, etiqueta: p.nombre }));
        this.cd.detectChanges();
      },
      error: err => console.error('Error al cargar provincias', err)
    });

    this.censoService.cargarActividadesDeportivas({ activo: true }).subscribe({
      next: (respuesta: ApiResponse<ActividadDeportiva[]>) => {
        this.deportes = respuesta.data.map(d => ({ valor: d.id, etiqueta: d.nombre }));
        this.cd.detectChanges();
      },
      error: err => console.error('Error al cargar deportes', err)
    });

    this.censoService.cargarNivelesDotacion({ activo: true }).subscribe({
      next: (respuesta: ApiResponse<Filtros[]>) => {
        this.nivelDotacion = respuesta.data.map(n => ({ valor: n.id!, etiqueta: n.nombre! }));
        this.cd.detectChanges();
      },
      error: err => console.error('Error al cargar niveles de dotación', err)
    });
  }

  /**
   * Al cambiar de provincia: limpia el municipio y recarga los municipios de esa provincia.
   */
  onProvinciaChange(idProvincia: string | number | null): void {
    this.modelo.municipio = '';
    this.municipios = [];

    if (idProvincia === null || idProvincia === '') {
      return;
    }

    this.cargandoMunicipios = true;
    const filtros: Filtros = { idProvincia: Number(idProvincia), activo: true };

    this.censoService.cargarMunicipios(filtros).subscribe({
      next: (respuesta: ApiResponse<Municipio[]>) => {
        this.municipios = respuesta.data.map(m => ({ valor: m.id, etiqueta: m.nombre }));
        this.cargandoMunicipios = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error al cargar municipios', err);
        this.cargandoMunicipios = false;
        this.cd.detectChanges();
      }
    });
  }

  buscar(): void {
    const m = this.modelo;
    this.router.navigate(['/instalaciones'], {
      queryParams: {
        nombre: m.nombre.trim() || null,
        provincia: m.provincia ? Number(m.provincia) : null,
        municipio: m.municipio ? Number(m.municipio) : null,
        deporte: m.deporte || null,
        nivelDotacion: m.nivelDotacion || null,
        zonaDeportiva: m.zonaDeportiva || null,
        distrito: m.distrito || null,
        claseInstalacion: m.claseInstalacion || null,
        modalidad: m.modalidad || null,
        tipoEspacio: m.tipoEspacio || null,
        tipoGestor: m.tipoGestor || null
      }
    });
  }

  limpiar(): void {
    this.modelo = this.modeloVacio();
    this.municipios = [];
  }

  private modeloVacio() {
    return {
      nombre: '',
      provincia: '',
      zonaDeportiva: '',
      municipio: '',
      distrito: '',
      claseInstalacion: '',
      deporte: '',
      modalidad: '',
      tipoEspacio: '',
      tipoGestor: '',
      nivelDotacion: ''
    };
  }
}
