import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {SelectModule} from 'primeng/select';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Configuracion} from '../../models/configuracion';
import {register} from 'swiper/element/bundle';
import {Provincia} from '../../models/provincia';
import {Municipio} from '../../models/municipio';
import {ActividadDeportiva} from '../../models/actividaddeportiva';
import {InputNumberModule} from 'primeng/inputnumber';
import {Filtros} from '../../filtros/filtros';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputNumberModule, TextareaModule],
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  // 1. Cambiamos el tipo a SafeHtml
  mapa: string | null;
  anchura: number | null = 480;
  altura: number | null = 320;
  provincias: Provincia[] = [];
  provinciaSeleccionada: number | null = null;
  municipios: Municipio[] = [];
  municipioSeleccionada: number | null = null;
  deportes: ActividadDeportiva[] = [];
  deporteSeleccionada: number | null = null;

  filtros: Filtros = {
    activo: true
  };

  constructor(
    private censoService: CensoService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    register();
  }

  ngOnInit(): void {
    this.cargarCombos();
  }

  cargarCombos() {
    this.censoService.cargarProvincias(this.filtros).subscribe({
      next: (response: ApiResponse<any>) => {
        this.provincias = [
          {
            id: null,
            nombre: 'Todas'
          },
          ...(response.data ?? [])
        ];

        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar provincias', err)
    });

    /*
    this.censoService.cargarMunicipios().subscribe({
      next: (response: ApiResponse<any>) => {
        this.municipios = [
          {
            id: null,
            ine: '',
            nombre: 'Todas',
            activo: true
          },
          ...(response.data ?? [])
        ];
      },
      error: (err) => console.error('Error al cargar provincias', err)
    });
    */

    this.censoService.cargarActividadesDeportivas().subscribe({
      next: (response: ApiResponse<any>) => {
        this.filtros.activo = true;
        this.deportes = [
          {
            id: null,
            nombre: 'Todas',
          },
          ...(response.data ?? [])
        ];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar deportes', err)
    });
  }

  generarEnlace() {
    const url = 'xxxxxxx/mapa-widget?pIdProvincia=' + this.provinciaSeleccionada + '&pIdIdioma=es';
    const width = this.anchura ?? 480;
    const height = this.altura ?? 320;

    this.mapa = `<iframe src="${url}" frameborder="0" width="${width}" height="${height}"></iframe>`;
    this.cd.detectChanges();
  }

}
