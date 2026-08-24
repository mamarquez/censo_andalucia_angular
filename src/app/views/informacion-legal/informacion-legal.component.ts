import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Configuracion} from '../../models/configuracion';
import {Filtros} from '../../filtros/filtros';
import {LoaderComponent} from '../../layout/loader/loader.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-informacion-legal',
  imports: [CommonModule, FormsModule, LoaderComponent, TranslatePipe],
  templateUrl: './informacion-legal.component.html',
  styleUrls: ['./informacion-legal.component.css']
})
export class InformacionLegalComponent implements OnInit {

  cargando: boolean = true;

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
  }

  ngOnInit(): void {
    this.cargarValor('Aviso Legal', 'avisoLegal');
    this.cargarValor('Privacidad', 'privacidad');
    this.cargando = false;
    this.cd.detectChanges();
  }

  cargarValor(campo: string, propiedad: 'avisoLegal' | 'privacidad'): void {
    this.censoService.cargarConfiguraciones(this.filtros).subscribe({
      next: (response: ApiResponse<Configuracion[]>) => {
        if (response.data && response.data.length > 0) {
          const htmlCrudo = response.data[0].valor;
          this[propiedad] = this.sanitizer.bypassSecurityTrustHtml(htmlCrudo);
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error(`Error al cargar ${campo}`, err)
    });
  }
}
