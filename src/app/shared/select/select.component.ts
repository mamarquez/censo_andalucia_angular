import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Opción de un {@link SelectComponent}.
 *
 * `valor` es lo que se enlaza con el modelo (id numérico, código, etc.);
 * `etiqueta` es el texto visible.
 */
export interface OpcionSelect {
  valor: string | number;
  etiqueta: string;
}

/**
 * Select genérico y reutilizable del censo.
 *
 * <p>Implementa {@link ControlValueAccessor}, por lo que funciona indistintamente con
 * `[(ngModel)]` o con `formControlName`. No sabe nada del dominio: las opciones se
 * inyectan por `@Input`.</p>
 *
 * <pre>
 * &lt;app-select
 *   [opciones]="provincias"
 *   [etiqueta]="'index.provincia' | translate"
 *   [(ngModel)]="modeloBusqueda.provincia"&gt;
 * &lt;/app-select&gt;
 * </pre>
 *
 * @author Duncan
 * @version 1.0.0
 */
@Component({
  standalone: true,
  selector: 'app-select',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  /** Lista de opciones a mostrar. */
  @Input({ required: true }) opciones: OpcionSelect[] = [];

  /** Texto de la etiqueta `<label>`. Si es vacío no se renderiza el label. */
  @Input() etiqueta = '';

  /** Id del control (para el `for` del label y accesibilidad). */
  @Input() idControl = `select-${Math.random().toString(36).slice(2, 9)}`;

  /** Clave i18n del texto de la opción "sin selección". Vacío -> sin opción vacía. */
  @Input() placeholderKey = 'index.todos';

  /** Texto del atributo `title` del `<select>` (tooltip). */
  @Input() titulo = '';

  /** Deshabilita el control desde el componente padre. */
  @Input()
  set deshabilitado(valor: boolean) {
    this.deshabilitadoInput.set(valor);
  }
  get deshabilitado(): boolean {
    return this.deshabilitadoInput();
  }

  /**
   * Emite el valor normalizado cada vez que el usuario cambia la selección.
   * Complementa a `[(ngModel)]`; útil para selects encadenados (provincia -> municipio).
   */
  @Output() readonly cambio = new EventEmitter<string | number | null>();

  /** Valor actual (string, porque `<select>` siempre opera con strings). */
  readonly valor = signal<string>('');

  /** Deshabilitado pedido por el padre vía `@Input`. */
  private readonly deshabilitadoInput = signal(false);

  /** Deshabilitado impuesto por Angular Forms (`FormControl.disable()`). */
  private readonly deshabilitadoForm = signal(false);

  /** El `<select>` se deshabilita si lo pide el padre o Forms. */
  readonly bloqueado = computed(() => this.deshabilitadoInput() || this.deshabilitadoForm());

  private alCambiar: (valor: string | number | null) => void = () => {};
  private alTocar: () => void = () => {};

  /** Handler del evento `change` del `<select>` nativo. */
  onSelect(event: Event): void {
    const bruto = (event.target as HTMLSelectElement).value;
    this.valor.set(bruto);
    const normalizado = this.normalizar(bruto);
    this.alCambiar(normalizado);
    this.cambio.emit(normalizado);
  }

  onBlur(): void {
    this.alTocar();
  }

  // --- ControlValueAccessor ---

  writeValue(valor: string | number | null | undefined): void {
    this.valor.set(valor === null || valor === undefined ? '' : String(valor));
  }

  registerOnChange(fn: (valor: string | number | null) => void): void {
    this.alCambiar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.alTocar = fn;
  }

  setDisabledState(deshabilitado: boolean): void {
    this.deshabilitadoForm.set(deshabilitado);
  }

  /**
   * Devuelve `null` para "sin selección", un `number` si todas las opciones que
   * coinciden son numéricas, o el string tal cual en otro caso.
   */
  private normalizar(bruto: string): string | number | null {
    if (bruto === '') {
      return null;
    }
    const opcion = this.opciones.find(o => String(o.valor) === bruto);
    return opcion && typeof opcion.valor === 'number' ? opcion.valor : bruto;
  }
}
