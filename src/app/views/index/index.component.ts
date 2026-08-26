import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import {register} from 'swiper/element/bundle';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-inicio',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioComponent {

  constructor(private router: Router) {
    register();
  }

  modeloBusqueda = {
    nombreInstalacion: ''
  };

  buscar(): void {
    this.router.navigate(['/instalaciones'], {
      queryParams: { nombre: this.modeloBusqueda.nombreInstalacion.trim() || null }
    });
  }
}
