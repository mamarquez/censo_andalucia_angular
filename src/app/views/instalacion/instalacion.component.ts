import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Instalacion} from '../../models/instalacion';
import {LoaderComponent} from '../../layout/loader/loader.component';
import {MapaComponent} from '../../shared/mapa/mapa.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CoordenadaComponent } from './modal/coordenada.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';
import { GaleroaInstalacionComponent } from './galeria/galeria.component';
import { RutaComponent } from "./ruta/ruta.component";
import { DeportivaInstalacionComponent } from './deportivas/deportiva.component';

@Component({
  standalone: true,
  selector: 'app-instalacion',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoaderComponent,
    MapaComponent,
    TranslatePipe,
    CoordenadaComponent,
    UbicacionComponent,
    GaleroaInstalacionComponent,
    RutaComponent,
    DeportivaInstalacionComponent
],
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.css']
})
export class InstalacionComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly censoService = inject(CensoService);
  private readonly cd = inject(ChangeDetectorRef);

  cargando: boolean = true;

  /** Se pone a true si la instalación no existe (404) o la carga falla. */
  error: boolean = false;

  /** true en concreto cuando el backend responde 404. */
  noEncontrada: boolean = false;

  coordenadaX: string = '';
  coordenadaY: string = '';

  instalacion: Instalacion | null = null;
  
  ngOnInit(): void {
    this.censoService.mostrarContadores.set(false);
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.cargarDatos(id);
    }
  }

  cargarDatos(id: string): void {
    this.cargando = true;
    this.error = false;
    this.noEncontrada = false;

    this.censoService.cargarInstalacion(id).subscribe({
      next: (response: ApiResponse<Instalacion>) => {
        this.instalacion = response.data ?? null;
        this.error = this.instalacion === null;
        this.noEncontrada = this.instalacion === null;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la instalación', err);
        this.error = true;
        this.noEncontrada = err.status === 404;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  mostrarModalCoordenadas(x: string, y: string): void {
    this.coordenadaX = x;
    this.coordenadaY = y;
  }

}
