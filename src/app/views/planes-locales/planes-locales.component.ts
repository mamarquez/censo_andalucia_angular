import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser'; // <--- IMPORTAR
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Configuracion} from '../../models/configuracion';
import {register} from 'swiper/element/bundle';
import {Filtros} from '../../filtros/filtros';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './planes-locales.component.html',
  styleUrls: ['./planes-locales.component.css']
})
export class PlanesLocalesComponent implements OnInit {

  planes: SafeHtml = '';
  filtros: Filtros = {
    nombre: 'planes',
    activo: true
  };

  constructor(
    private readonly censoService: CensoService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer
  ) {
    register();
  }

  ngOnInit(): void {
    this.cargarValor('planes', 'planes');
  }

  cargarValor(campo: string, propiedad: 'planes'): void {
    this.censoService.cargarConfiguraciones(this.filtros).subscribe({
      next: (response: ApiResponse<Configuracion[]>) => {
        if (response.data && response.data.length > 0) {
          const htmlCrudo = response.data[0].valor;
          // Seguro: Configuracion.valor solo lo escribe un administrador autenticado
          // desde el panel de gestión interno, nunca un usuario público.
          const htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(htmlCrudo);

          this[propiedad] = htmlSeguro;
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error(`Error al cargar ${campo}`, err)
    });
  }
}
