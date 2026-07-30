import {Component, Input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  @Input() cargando: boolean = false;
}
