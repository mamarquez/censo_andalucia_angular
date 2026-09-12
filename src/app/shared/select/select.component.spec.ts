import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';

import { SelectComponent, OpcionSelect } from './select.component';

describe('SelectComponent', () => {
  const opciones: OpcionSelect[] = [
    { valor: 1, etiqueta: 'Uno' },
    { valor: 2, etiqueta: 'Dos' },
    { valor: 'texto', etiqueta: 'Texto' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [provideTranslateService()]
    });
  });

  function crear() {
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('opciones', opciones);
    fixture.detectChanges();
    return fixture;
  }

  it('genera un idControl por defecto no vacío', () => {
    const fixture = crear();
    expect(fixture.componentInstance.idControl()).toMatch(/^select-/);
  });

  it('writeValue normaliza null/undefined a string vacío', () => {
    const fixture = crear();
    fixture.componentInstance.writeValue(null);
    expect(fixture.componentInstance.valor()).toBe('');

    fixture.componentInstance.writeValue(undefined);
    expect(fixture.componentInstance.valor()).toBe('');

    fixture.componentInstance.writeValue(2);
    expect(fixture.componentInstance.valor()).toBe('2');
  });

  it('onSelect normaliza a number cuando la opción coincidente es numérica', () => {
    const fixture = crear();
    const alCambiar = vi.fn();
    fixture.componentInstance.registerOnChange(alCambiar);

    const evento = { target: { value: '1' } } as unknown as Event;
    fixture.componentInstance.onSelect(evento);

    expect(fixture.componentInstance.valor()).toBe('1');
    expect(alCambiar).toHaveBeenCalledWith(1);
  });

  it('onSelect normaliza a string cuando la opción coincidente es string', () => {
    const fixture = crear();
    const alCambiar = vi.fn();
    fixture.componentInstance.registerOnChange(alCambiar);

    const evento = { target: { value: 'texto' } } as unknown as Event;
    fixture.componentInstance.onSelect(evento);

    expect(alCambiar).toHaveBeenCalledWith('texto');
  });

  it('onSelect normaliza a null cuando el valor es cadena vacía', () => {
    const fixture = crear();
    const alCambiar = vi.fn();
    fixture.componentInstance.registerOnChange(alCambiar);

    const evento = { target: { value: '' } } as unknown as Event;
    fixture.componentInstance.onSelect(evento);

    expect(alCambiar).toHaveBeenCalledWith(null);
  });

  it('onSelect emite el evento cambio con el valor normalizado', () => {
    const fixture = crear();
    const emitido: Array<string | number | null> = [];
    fixture.componentInstance.cambio.subscribe(v => emitido.push(v));

    const evento = { target: { value: '2' } } as unknown as Event;
    fixture.componentInstance.onSelect(evento);

    expect(emitido).toEqual([2]);
  });

  it('onBlur invoca el callback registrado con registerOnTouched', () => {
    const fixture = crear();
    const alTocar = vi.fn();
    fixture.componentInstance.registerOnTouched(alTocar);

    fixture.componentInstance.onBlur();

    expect(alTocar).toHaveBeenCalled();
  });

  it('deshabilitado combina input del padre y setDisabledState (bloqueado)', () => {
    const fixture = crear();
    expect(fixture.componentInstance.bloqueado()).toBe(false);

    fixture.componentInstance.deshabilitado = true;
    expect(fixture.componentInstance.bloqueado()).toBe(true);

    fixture.componentInstance.deshabilitado = false;
    fixture.componentInstance.setDisabledState(true);
    expect(fixture.componentInstance.bloqueado()).toBe(true);
  });
});
