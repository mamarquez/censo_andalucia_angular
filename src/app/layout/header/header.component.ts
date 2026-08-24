import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { CensoService } from '../../services/censoService.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly gestion = `${environment.gestion}`;
  private readonly censoService = inject(CensoService);
  readonly translateService = inject(TranslateService);

  toggleMenu(): void {
    this.censoService.menuAbierto.update(abierto => !abierto);
  }

  cambiarIdioma(idioma: string): void {
    this.translateService.use(idioma);
  }
}
