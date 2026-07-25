import { Routes } from '@angular/router';
import {WidgetComponent} from './views/widget/widget.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    // Cuando el usuario vaya a /index, carga el InicioComponent
    path: 'index',
    loadComponent: () => import('./views/index/index.component').then(m => m.InicioComponent)
  },
  {
    path: "informacion-legal",
    loadComponent: () => import('./views/informacion-legal/informacion-legal.component').then(m => m.InformacionLegalComponent)
  },
  {
    path: "acerca-de-los-datos-del-censo",
    loadComponent: () => import('./views/acerca/acerca.component').then(m => m.AcercaComponent)
  },
  {
    path: "municipios-planes-locales",
    loadComponent: () => import('./views/planes-locales/planes-locales.component').then(m => m.PlanesLocalesComponent)
  },
  {
    path: "obtener-widget",
    loadComponent: () => import('./views/widget/widget.component').then(m => m.WidgetComponent)
  },
  /*
  {
    // Como en el componente hicimos this.router.navigate(['/resultados-busqueda']),
    // necesitamos esta ruta para que no falle al pulsar "Buscar".
    // (Crea este componente cuando sigas avanzando)
    path: 'resultados-busqueda',
    loadComponent: () => import('./pages/resultados-busqueda/resultados-busqueda.component').then(m => m.ResultadosBusquedaComponent)
  },
  */
  {
    // Si el usuario escribe una URL que no existe, lo mandamos a index
    path: '**',
    redirectTo: 'index'
  }
];
