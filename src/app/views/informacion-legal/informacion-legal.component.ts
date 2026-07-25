import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // <--- IMPORTAR
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Configuracion } from '../../models/configuracion';
import { register } from 'swiper/element/bundle';
import {Filtros} from '../../filtros/filtros';

@Component({
  selector: 'app-informacion-legal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './informacion-legal.component.html',
  styleUrls: ['./informacion-legal.component.css']
})
export class InformacionLegalComponent implements OnInit {

  // 1. Cambiamos el tipo a SafeHtml
  avisoLegal: SafeHtml = '';
  privacidad: SafeHtml = '';
  filtros: Filtros = {
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
    this.cargarValor('Aviso Legal', 'avisoLegal');
    this.cargarValor('Privacidad', 'privacidad');
  }

  cargarValor(campo: string, propiedad: 'avisoLegal' | 'privacidad'): void {
    this.censoService.cargarConfiguraciones(this.filtros).subscribe({
      next: (response: ApiResponse<Configuracion[]>) => {
        if (response.data && response.data.length > 0) {
          const htmlCrudo = response.data[0].valor;

          // 2. Sanitizamos el HTML para que Angular confíe en él
          const htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(htmlCrudo);

          // 3. Asignamos el HTML seguro a la variable
          this[propiedad] = htmlSeguro;
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error(`Error al cargar ${campo}`, err)
    });
  }
}
