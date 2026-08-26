import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { ContadorComponent } from './layout/contador/contador.component';
import { FooterComponent } from './layout/footer/footer.component';
import {CensoService} from './services/censoService.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuComponent, ContadorComponent, FooterComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('censo_andalucia_angular');
  censoService = inject(CensoService);
}
