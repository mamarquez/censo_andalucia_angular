import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { register } from 'swiper/element/bundle';
import { TranslatePipe } from '@ngx-translate/core';

import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';
import { Municipio } from '../../models/municipio';
import { ActividadDeportiva } from '../../models/actividaddeportiva';
import { NivelDotacion } from '../../models/niveldotacion';
import { Filtros } from '../../filtros/filtros';
import { OpcionSelect, SelectComponent } from '../../shared/select/select.component';

@Component({
  standalone: true,
  selector: 'app-inicio',
  imports: [CommonModule, FormsModule, TranslatePipe, SelectComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly censoService: CensoService,
    private readonly cd: ChangeDetectorRef
  ) {
    register();
  }

  /** Panel de filtros avanzados desplegado (botón "+ Más"). */
  busquedaAvanzada = false;

  /** Opciones para el <app-select> de provincia. */
  provincias: OpcionSelect[] = [];

  /** Opciones para el <app-select> de municipio; dependen de la provincia elegida. */
  municipios: OpcionSelect[] = [];

  /** Opciones para el <app-select> de deporte. */
  deportes: OpcionSelect[] = [];

  /** Opciones para el <app-select> de nivel de dotación. */
  nivelDotacionOpciones: OpcionSelect[] = [];

  /** Evita permitir elegir municipio mientras no haya provincia o se estén cargando. */
  cargandoMunicipios = false;

  modeloBusqueda = {
    nombreInstalacion: '',
    provincia: '',
    municipio: '',
    claseInstalacion: '',
    deporte: '',
    nivelDotacion: ''
  };

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
      next: (respuesta: ApiResponse<NivelDotacion[]>) => {
        this.nivelDotacionOpciones = respuesta.data.map(n => ({ valor: n.id, etiqueta: n.nombre }));
        this.cd.detectChanges();
      },
      error: err => console.error('Error al cargar niveles de dotación', err)
    });
  }

  alternarAvanzada(): void {
    this.busquedaAvanzada = !this.busquedaAvanzada;
  }

  /**
   * Reacciona al cambio de provincia: limpia el municipio seleccionado y recarga
   * la lista de municipios de esa provincia.
   */
  onProvinciaChange(idProvincia: string | number | null): void {
    this.modeloBusqueda.municipio = '';
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
    const m = this.modeloBusqueda;
    this.router.navigate(['/instalaciones'], {
      queryParams: {
        nombre: m.nombreInstalacion.trim() || null,
        // Los <select> devuelven string; el backend espera el id numérico de provincia/municipio.
        provincia: m.provincia ? Number(m.provincia) : null,
        municipio: m.municipio ? Number(m.municipio) : null,
        claseInstalacion: m.claseInstalacion || null,
        deporte: m.deporte || null,
        nivelDotacion: m.nivelDotacion || null
      }
    });
  }
}
