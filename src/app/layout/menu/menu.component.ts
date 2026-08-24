import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CensoService } from '../../services/censoService.service';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  private readonly censoService = inject(CensoService);

  readonly menuAbierto = this.censoService.menuAbierto;

  cerrarMenu(): void {
    this.censoService.menuAbierto.set(false);
  }
}
