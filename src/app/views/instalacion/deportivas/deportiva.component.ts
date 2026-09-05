import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { HttpErrorResponse } from '@angular/common/http';
import { InstalacionEspacioDeportivo } from '../../../models/instalacion-espacio-deportivo';

@Component({
  standalone: true,
  selector: 'app-instalacion-deportiva',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './deportiva.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeportivaInstalacionComponent {

    private readonly censoService = inject(CensoService);

    idInstalacion = input<number>();
    cargando = signal(false);
    espacios = signal<InstalacionEspacioDeportivo[]>([]);

    constructor() {
        effect(() => {
            const id = this.idInstalacion();

            if (id !== undefined && id !== null) {
                this.cargarEspaciosDeportivos(id);
            }
        });
    }

    private cargarEspaciosDeportivos(id: number): void {
        this.cargando.set(true);

        this.censoService.cargarInstalacionesDeportivas(id).subscribe({
            next: (response: ApiResponse<InstalacionEspacioDeportivo[]>) => {
                console.log('Espacios deportivos cargados:', response.data);
                this.espacios.set(response.data || []);
                this.cargando.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al cargar los espacios deportivos de la instalación', err);
                this.cargando.set(false);
            }
        });
    }
}
