import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MessageService} from 'primeng/api';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {LoaderComponent} from '../../layout/loader/loader.component';
import {register} from 'swiper/element/bundle';
import {Instalacion} from '../../models/instalacion';
import {Filtros} from '../../filtros/filtros';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-instalaciones',
  imports: [CommonModule, FormsModule, LoaderComponent, TranslatePipe, RouterLink],
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstalacionesComponent implements OnInit {

  cargando: boolean = true;

  /** true si la carga del listado ha fallado. */
  error: boolean = false;

  filtros: Filtros = {
    baja: false
  };

  constructor(
    private readonly censoService: CensoService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
    private readonly messageService: MessageService
  ) {
    register();
  }

  modeloBusqueda = {
    nombreInstalacion: '',
    provincia: '',
    municipio: '',
    claseInstalacion: '',
    deporte: '',
    nivelDotacion: ''
  };

  instalaciones: Instalacion[] = [];

  // 4. Reemplaza el archivo Resources.resx
  resources = {
    inicio: 'Inicio',
    minimoTresCaracteres: 'Mínimo 3 caracteres',
    escribeAlgo: 'Escribe algo...',
    buscar: 'Buscar',
    mas: 'Más',
    cerrar: 'Cerrar',
    todos: 'Todos',
    municipio: 'Municipio',
    tipoInstalacion: 'Tipo de instalación',
    deporte: 'Deporte',
    nivelDotacion: 'Nivel de dotación',
    instalaciones: 'Instalaciones',
    espaciosDeportivos: 'Espacios deportivos',
    espaciosComplementarios: 'Espacios complementarios',
    modalidadDeportiva: 'Modalidad deportiva'
  };

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    const nombre = params.get('nombre');
    if (nombre) {
      this.filtros.nombre = nombre;
      this.modeloBusqueda.nombreInstalacion = nombre;
    }

    const provincia = params.get('provincia');
    if (provincia) {
      // El backend (FiltroInstalacionRequest.provincia) espera el id numérico.
      this.filtros.provincia = Number(provincia);
      this.modeloBusqueda.provincia = provincia;
    }

    const municipio = params.get('municipio');
    if (municipio) {
      this.filtros.municipio = Number(municipio);
      this.modeloBusqueda.municipio = municipio;
    }

    const deporte = params.get('deporte');
    if (deporte) {
      this.filtros.deporte = Number(deporte);
      this.modeloBusqueda.deporte = deporte;
    }

    const claseInstalacion = params.get('claseInstalacion');
    if (claseInstalacion) {
      this.filtros.claseInstalacion = claseInstalacion;
      this.modeloBusqueda.claseInstalacion = claseInstalacion;
    }

    const nivelDotacion = params.get('nivelDotacion');
    if (nivelDotacion) {
      this.filtros.nivelDotacion = Number(nivelDotacion);
      this.modeloBusqueda.nivelDotacion = nivelDotacion;
    }

    this.cargarInstalaciones();
  }

  cargarInstalaciones(): void {
    this.cargando = true;
    this.error = false;

    this.censoService.cargarInstalaciones(this.filtros).subscribe({
      next: (response: ApiResponse<any>) => {
        this.instalaciones = response.data ?? [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar instalaciones', err);
        this.instalaciones = [];
        this.error = true;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  buscar(): void {
    // Lógica de búsqueda
  }

  descargarExcel(): void {
    this.censoService.exportarInstalacionesExcel(this.filtros).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'listado.xlsx';
        enlace.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar el listado a Excel', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se ha podido descargar el listado en Excel'
        });
      }
    });
  }
}
