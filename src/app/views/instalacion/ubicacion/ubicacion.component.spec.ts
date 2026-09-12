import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';

import { UbicacionComponent } from './ubicacion.component';

describe('UbicacionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UbicacionComponent],
      providers: [provideTranslateService()]
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function crear() {
    const fixture = TestBed.createComponent(UbicacionComponent);
    fixture.componentRef.setInput('id', '10');
    fixture.detectChanges();
    return fixture;
  }

  it('anchura y altura tienen valores por defecto', () => {
    const fixture = crear();
    expect(fixture.componentInstance.anchura()).toBe(480);
    expect(fixture.componentInstance.altura()).toBe(320);
  });

  it('codigo genera un iframe con el id, anchura y altura actuales', () => {
    const fixture = crear();
    const codigo = fixture.componentInstance.codigo();

    expect(codigo).toContain('<iframe');
    expect(codigo).toContain('/instalacion/10');
    expect(codigo).toContain('width="480"');
    expect(codigo).toContain('height="320"');
  });

  it('codigo se recalcula si cambian anchura/altura', () => {
    const fixture = crear();
    fixture.componentInstance.anchura.set(600);
    fixture.componentInstance.altura.set(400);

    const codigo = fixture.componentInstance.codigo();
    expect(codigo).toContain('width="600"');
    expect(codigo).toContain('height="400"');
  });

  it('copiar escribe en el portapapeles y activa copiado por 2 segundos', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const fixture = crear();
    fixture.componentInstance.copiar();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith(fixture.componentInstance.codigo());
    expect(fixture.componentInstance.copiado()).toBe(true);

    vi.advanceTimersByTime(2000);
    expect(fixture.componentInstance.copiado()).toBe(false);
  });

  it('copiar no lanza si no hay navigator.clipboard', () => {
    Object.assign(navigator, { clipboard: undefined });

    const fixture = crear();
    expect(() => fixture.componentInstance.copiar()).not.toThrow();
  });
});
