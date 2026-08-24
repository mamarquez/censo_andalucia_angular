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
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {

  acerca: SafeHtml = '';
  filtros: Filtros = {
    nombre: 'acerca',
    activo: true
  };

  constructor(
    private censoService: CensoService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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
          this.acerca = this.sanitizer.bypassSecurityTrustHtml(htmlCrudo);
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error(`Error al cargar acerca`, err)
    });
  }
}
