import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CensoService} from '../../services/censoService.service';
import {ApiResponse} from '../../models/apiresponse';
import {Instalacion} from '../../models/instalacion';
import {LoaderComponent} from '../../layout/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-instalacion',
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.css']
})
export class InstalacionComponent implements OnInit {
  cargando: boolean = true;

  instalacion: Instalacion = {} as Instalacion;

  constructor(
    private route: ActivatedRoute,
    private censoService: CensoService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.censoService.mostrarContadores.set(false);
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.cargarDatos(id);
    }
  }

  cargarDatos(id: string): void {
    this.censoService.cargarInstalacion(id).subscribe({
      next: (response: ApiResponse<Instalacion>) => {
        this.instalacion = response.data;

        console.log(response.data);

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la instalación', err);
        this.cargando = false;
      }
    });
  }

}
