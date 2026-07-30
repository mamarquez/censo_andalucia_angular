import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiResponse} from '../../models/apiresponse';
import {Configuracion} from '../../models/configuracion';
import {CensoService} from '../../services/censoService.service';
import {Router, RouterLink} from '@angular/router';
import {Filtros} from '../../filtros/filtros';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  version = `${environment.version}`;
  readonly anio: number = new Date().getFullYear();

  filtros: Filtros = {
    nombre: 'version',
    activo: true
  };

  constructor(private censoService: CensoService, private router: Router, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.censoService.cargarConfiguraciones(this.filtros).subscribe({
      next: (response: ApiResponse<Configuracion[]>) => {
        if (response.data && response.data.length > 0) {
          this.version = response.data[0].valor || "1.0.0";
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar configuración', err)
    });
  }
}
