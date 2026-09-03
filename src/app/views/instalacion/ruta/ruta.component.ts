import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { InstalacionRuta } from '../../../models/instalacion-ruta';
import { InstalacionRutaCoordenada } from '../../../models/instalacion-ruta-coordenada';
import { environment } from '../../../environments/environment';
import { MapaComponent } from '../../../shared/mapa/mapa.component';

/**
 * Muestra la pantalla de rutas de la instalación, con un mapa y la lista de rutas.
 *
 * @author Duncan
 * @version 1.0.0
 */
@Component({
  standalone: true,
  selector: 'app-ruta-instalacion',
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MapaComponent
],
  templateUrl: './ruta.component.html',
  styles: [`
    .mapa-mini-ruta {
      display: block;
      width: 220px;
      height: 160px;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RutaComponent {

    private readonly censoService = inject(CensoService);
    private readonly api = `${environment.apiUrl}`;

    idInstalacion = input<number>();

    cargando = signal(false);
    rutas = signal<InstalacionRuta[]>([]);

    /** Puntos `[lat, lng]` del trazado de cada ruta, indexados por id de ruta. */
    puntosPorRuta = signal<Record<number, Array<[number, number]>>>({});

    constructor() {
        register();

        effect(() => {
            const id = this.idInstalacion();

            if (id !== undefined && id !== null) {
                this.cargarRutas(id);
            }
        });
    }

    urlDescargaKml(idRuta: number): string {
        return `${this.api}/instalacionesrutas/descargar/${idRuta}`;
    }

    private cargarRutas(id: number): void {
        this.cargando.set(true);

        this.censoService.cargarRutas(id).subscribe({
            next: (response: ApiResponse<InstalacionRuta[]>) => {
                const rutas = response.data || [];
                this.rutas.set(rutas);
                this.cargando.set(false);
                this.cargarCoordenadas(rutas);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al cargar las rutas de la instalación', err);
                this.cargando.set(false);
            }
        });
    }

    private cargarCoordenadas(rutas: InstalacionRuta[]): void {
        if (!rutas.length) {
            this.puntosPorRuta.set({});
            return;
        }

        const peticiones = rutas.reduce((acc, ruta) => {
            acc[ruta.id] = this.censoService.cargarCoordenadasRuta(ruta.id).pipe(
                catchError((err: HttpErrorResponse) => {
                    console.error(`Error al cargar las coordenadas de la ruta ${ruta.id}`, err);
                    return of({ message: '', data: [] } as ApiResponse<InstalacionRutaCoordenada[]>);
                })
            );
            return acc;
        }, {} as Record<number, ReturnType<CensoService['cargarCoordenadasRuta']>>);

        forkJoin(peticiones).subscribe(resultados => {
            const mapa: Record<number, Array<[number, number]>> = {};

            for (const [idRuta, response] of Object.entries(resultados)) {
                mapa[Number(idRuta)] = (response.data || []).map(c => [c.x, c.y] as [number, number]);
            }

            this.puntosPorRuta.set(mapa);
        });
    }

}