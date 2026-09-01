import {Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {register} from 'swiper/element/bundle';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { HttpErrorResponse } from '@angular/common/http';
import { InstalacionImagen } from '../../../models/instalacion-imagen';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-instalacion-galeria',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './galeria.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GaleroaInstalacionComponent {

    private readonly censoService = inject(CensoService);
    private readonly api = `${environment.apiUrl}`;

    idInstalacion = input<number>();
    cargando = false;
    imagenes: InstalacionImagen[] = [];

    constructor() {
        register();

        effect(() => {
            const id = this.idInstalacion();

            if (id !== undefined && id !== null) {
                this.cargarGaleria(id);
            }
        });
    }

    private cargarGaleria(id: number): void {
        this.cargando = true;

        this.censoService.cargarImagen(id).subscribe({
            next: (response: ApiResponse<InstalacionImagen[]>) => {
                // El backend solo devuelve metadata (id, nombre, descripción...), sin URL del
                // binario; se construye aquí contra el endpoint que sí sirve el fichero:
                // GET /v1/instalacionesgaleria/images/{nombre}.
                this.imagenes = (response.data || []).map(img => ({
                    ...img,
                    url: `${this.api}/instalacionesgaleria/images/${img.nombre}`
                }));
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al cargar las imágenes de la galería', err);
                this.cargando = false;
            }
        });
    }
}
