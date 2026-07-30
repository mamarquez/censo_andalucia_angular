import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {LoaderComponent} from '../../layout/loader/loader.component';
import {register} from 'swiper/element/bundle';
import {Instalacion} from '../../models/instalacion';
import {Filtros} from '../../filtros/filtros';

@Component({
  standalone: true,
  selector: 'app-instalaciones',
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstalacionesComponent implements OnInit {

  cargando: boolean = true;

  filtros: Filtros = {
    baja: false
  };

  constructor(private censoService: CensoService, private router: Router, private cd: ChangeDetectorRef) {
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
}
