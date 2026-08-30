import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Página 404: se muestra para cualquier ruta que no exista.
 *
 * @author Duncan
 * @version 1.0.0
 */
@Component({
  standalone: true,
  selector: 'app-no-encontrado',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './no-encontrado.component.html',
  styleUrls: ['./no-encontrado.component.css']
})
export class NoEncontradoComponent {}
