import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Instalacion} from '../../models/instalacion';
import {LoaderComponent} from '../../layout/loader/loader.component';
import {MapaComponent} from '../../shared/mapa/mapa.component';
import {TranslatePipe} from '@ngx-translate/core';
import { CoordenadaComponent } from './modal/coordenada.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';

@Component({
  standalone: true,
  selector: 'app-instalacion',
  imports: [CommonModule, FormsModule, LoaderComponent, MapaComponent, TranslatePipe, CoordenadaComponent, UbicacionComponent],
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.css']
})
export class InstalacionComponent implements OnInit {
  cargando: boolean = true;

  coordenadaX: string = '';
  coordenadaY: string = '';

  instalacion: Instalacion | null = null;

  constructor(
    private route: ActivatedRoute,
    private censoService: CensoService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.censoService.mostrarContadores.set(false);
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.cargarDatos(id);
    }
  }

  cargarDatos(id: string): void {
    this.censoService.cargarInstalacion(id).subscribe({
      next: (response: ApiResponse<Instalacion>) => {
        this.instalacion = response.data;

        console.log(response.data);

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la instalación', err);
        this.cargando = false;
      }
    });
  }

  mostrarModalCoordenadas(x: string, y: string): void {
    this.coordenadaX = x;
    this.coordenadaY = y;
  }

}
