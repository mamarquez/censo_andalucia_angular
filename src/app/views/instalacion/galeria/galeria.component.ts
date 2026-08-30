import {Component, effect, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import { CensoService } from '../../../services/censoService.service';

@Component({
  standalone: true,
  selector: 'app-instalacion-galeria',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './galeria.component.html',
})
export class GaleroaInstalacionComponent {

    private readonly service = inject(CensoService);
    
    idInstalacion = input<number>();
    cargando = false;

    constructor() {
        effect(() => {
            const id = this.idInstalacion();
            
            if (id !== undefined && id !== null) {
                this.cargarGaleria(id);
            }
        });
    }

    private cargarGaleria(id: number): void {
        console.log('Cargando datos para la instalación ID:', id);
        // Aquí ejecutas la petición a tu servicio
        // this.censoService.getGaleria(id).subscribe(...);
    }
}
