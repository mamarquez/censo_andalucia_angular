import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';

import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioComponent implements OnInit {

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

  provincias: Provincia[] = [];
  municipios: any[] = [];
  clasesInstalacion: any[] = [];
  deportes: any[] = [];
  nivelesDotacion: any[] = [];

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
    this.cargarProvincias();
  }

  cargarProvincias(): void {
    this.censoService.cargarProvincias().subscribe({
      next: (response: ApiResponse<Provincia[]>) => {
        this.provincias = response.data;
      },
      error: (err) => console.error('Error al cargar provincias', err)
    });
  }

  buscar(): void {
    // Lógica de búsqueda
  }
}
