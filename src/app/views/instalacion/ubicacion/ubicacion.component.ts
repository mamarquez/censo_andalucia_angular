import {Component, computed, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Modal "Muestra esta instalación en tu web": genera el código `<iframe>`
 * embebible para la instalación, con anchura/altura configurables.
 *
 * @author Duncan
 * @version 1.1.0
 */
@Component({
  standalone: true,
  selector: 'app-modal-ubicacion',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './ubicacion.component.html',
})
export class UbicacionComponent {
  /** Id de la instalación a embeber. */
  id = input('');

  anchura = signal(480);
  altura = signal(320);

  /** Código `<iframe>` listo para copiar. */
  readonly codigo = computed(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${base}/instalacion/${this.id()}`;
    return `<iframe src="${url}" frameborder="0" width="${this.anchura()}" height="${this.altura()}"></iframe>`;
  });

  copiado = signal(false);

  copiar(): void {
    navigator.clipboard?.writeText(this.codigo()).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }
}
