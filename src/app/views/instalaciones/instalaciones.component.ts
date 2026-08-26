import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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
  imports: [CommonModule, FormsModule, LoaderComponent, TranslatePipe],
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstalacionesComponent implements OnInit {

  cargando: boolean = true;

  filtros: Filtros = {
    baja: false
  };

  constructor(
    private censoService: CensoService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
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
    const nombre = this.route.snapshot.queryParamMap.get('nombre');
    if (nombre) {
      this.filtros.nombre = nombre;
      this.modeloBusqueda.nombreInstalacion = nombre;
    }
    this.cargarInstalaciones();
  }

  cargarInstalaciones(): void {
    this.censoService.cargarInstalaciones(this.filtros).subscribe({
      next: (response: ApiResponse<any>) => {
        this.instalaciones = response.data;

        console.log(response.data);

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar instalaciones', err);
        this.cargando = false;
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
