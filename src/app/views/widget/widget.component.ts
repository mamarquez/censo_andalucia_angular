import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {SelectModule} from 'primeng/select';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {register} from 'swiper/element/bundle';
import {Provincia} from '../../models/provincia';
import {Municipio} from '../../models/municipio';
import {ActividadDeportiva} from '../../models/actividaddeportiva';
import {InputNumberModule} from 'primeng/inputnumber';
import {Filtros} from '../../filtros/filtros';
import { TextareaModule } from 'primeng/textarea';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputNumberModule, TextareaModule, TranslatePipe],
  templateUrl: './widget.component.html'
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

  cargandoProvincias = false;
  cargandoMunicipios = false;
  cargandoDeportes = false;

  filtros: Filtros = {
    activo: true
  };

  constructor(
    private readonly censoService: CensoService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
    register();
  }

  ngOnInit(): void {
    this.cargarCombos();
  }

  cargarCombos() {
    this.cargandoProvincias = true;
    this.cd.detectChanges();
    this.censoService.cargarProvincias(this.filtros).subscribe({
      next: (response: ApiResponse<any>) => {
        this.provincias = [
          {
            id: null,
            nombre: this.translateService.instant('widget.provincia_todas')
          },
          ...(response.data ?? [])
        ];

        this.cargandoProvincias = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar provincias', err);
        this.cargandoProvincias = false;
      }
    });

    this.cargarMunicipios();

    this.cargandoDeportes = true;
    this.cd.detectChanges();
    this.censoService.cargarActividadesDeportivas().subscribe({
      next: (response: ApiResponse<any>) => {
        this.filtros.activo = true;
        this.deportes = [
          {
            id: null,
            nombre: this.translateService.instant('widget.deporte_todos'),
          },
          ...(response.data ?? [])
        ];
        this.cargandoDeportes = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar deportes', err);
        this.cargandoDeportes = false;
      }
    });
  }

  cargarMunicipios() {
    const provinciaSeleccionada = this.provincias.find(p => p.id === this.provinciaSeleccionada);
    const municipiosFiltros: Filtros = {
      ...this.filtros,
      cpro: provinciaSeleccionada?.ine ?? null
    };

    this.cargandoMunicipios = true;
    this.cd.detectChanges();
    this.censoService.cargarMunicipios(municipiosFiltros).subscribe({
      next: (response: ApiResponse<any>) => {
        this.municipios = [
          {
            id: null,
            cpro: '',
            cmun: '',
            dc: '',
            nombre: this.translateService.instant('widget.municipio_todos'),
            activo: true
          },
          ...(response.data ?? [])
        ];
        this.cargandoMunicipios = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar municipios', err);
        this.cargandoMunicipios = false;
      }
    });
  }

  onProvinciaChange() {
    this.municipioSeleccionada = null;
    this.cargarMunicipios();
    this.generarEnlace();
  }

  generarEnlace() {
    const params = new URLSearchParams({ pIdIdioma: this.translateService.currentLang() ?? 'es' });

    if (this.provinciaSeleccionada !== null) {
      params.set('pIdProvincia', this.provinciaSeleccionada.toString());
    }
    if (this.municipioSeleccionada !== null) {
      params.set('pIdMunicipio', this.municipioSeleccionada.toString());
    }
    if (this.deporteSeleccionada !== null) {
      params.set('pIdDeporte', this.deporteSeleccionada.toString());
    }

    const url = `${environment.apiUrl}/mapa-widget?${params.toString()}`;
    const width = this.anchura ?? 480;
    const height = this.altura ?? 320;

    this.mapa = `<iframe src="${url}" frameborder="0" width="${width}" height="${height}"></iframe>`;
    this.cd.detectChanges();
  }

}
