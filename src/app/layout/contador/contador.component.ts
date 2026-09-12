import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiResponse} from '../../models/apiresponse';
import {Router} from '@angular/router';
import {CensoService} from '../../services/censoService.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-contador',
  imports: [TranslatePipe],
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.css']
})
export class ContadorComponent implements OnInit {

  contadores = {
    instalaciones: 0,
    deportivos: 0,
    complementarios: 0,
    modalidades: 0,
    rutas: 0
  };

  constructor(private readonly censoService: CensoService, private readonly router: Router, private readonly cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cargarContadorInstalacion();
    this.cargarContadorEspaciosDeportivos();
    this.cargarContadorEspaciosComplementarios();
    this.cargarContadorModalidadesDeportivas();
    this.cargarContadorActividadesDeportivas();
    this.cargarContadorRutas();
  }

  cargarContadorInstalacion(): void {
    this.censoService.numeroInstalaciones().subscribe({
      next: (response: ApiResponse<any>) => {
        this.contadores.instalaciones = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

  cargarContadorEspaciosDeportivos(): void {
    this.censoService.numeroEspaciosDeportivos().subscribe({
      next: (response: ApiResponse<any>) => {
        this.contadores.deportivos = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

  cargarContadorEspaciosComplementarios(): void {
    this.censoService.numeroEspaciosComplementarios().subscribe({
      next: (response: ApiResponse<any>) => {
        this.contadores.complementarios = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

  cargarContadorModalidadesDeportivas(): void {
    this.censoService.numeroModalidadesDeportivas().subscribe({
      next: (response: ApiResponse<any>) => {
        this.contadores.deportivos = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

  cargarContadorActividadesDeportivas(): void {
    this.censoService.numeroActividadesDeportivas().subscribe({
      next: (response: ApiResponse<number>) => {
        this.contadores.modalidades = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

  cargarContadorRutas(): void {
    this.censoService.numeroRutas().subscribe({
      next: (response: ApiResponse<any>) => {
        this.contadores.deportivos = response.data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar número de instalaciones', err)
    });
  }

}
