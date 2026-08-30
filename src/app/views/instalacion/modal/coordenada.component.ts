import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-modal-coordenada',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './coordenada.component.html',
})
export class CoordenadaComponent {
    x = input('');
    y = input('');
}
