import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Configuracion} from '../../models/configuracion';
import {register} from 'swiper/element/bundle';
import {Filtros} from '../../filtros/filtros';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-acerca',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './acerca.component.html'
})
export class AcercaComponent implements OnInit {

  acerca: SafeHtml = '';
  filtros: Filtros = {
    nombre: 'acerca',
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
    this.cargarValor();
  }

  cargarValor(): void {
    this.censoService.cargarConfiguraciones(this.filtros).subscribe({
      next: (response: ApiResponse<Configuracion[]>) => {
        if (response.data && response.data.length > 0) {
          const htmlCrudo = response.data[0].valor;
          // Seguro: Configuracion.valor solo lo escribe un administrador autenticado
          // desde el panel de gestión interno, nunca un usuario público.
          this.acerca = this.sanitizer.bypassSecurityTrustHtml(htmlCrudo);
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error(`Error al cargar acerca`, err)
    });
  }
}
