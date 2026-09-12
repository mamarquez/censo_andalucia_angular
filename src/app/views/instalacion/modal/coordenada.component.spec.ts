import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';

import { CoordenadaComponent } from './coordenada.component';

describe('CoordenadaComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoordenadaComponent],
      providers: [provideTranslateService()]
    });
  });

  it('x e y por defecto son cadena vacía', () => {
    const fixture = TestBed.createComponent(CoordenadaComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.x()).toBe('');
    expect(fixture.componentInstance.y()).toBe('');
  });

  it('acepta x e y por @Input (signal input)', () => {
    const fixture = TestBed.createComponent(CoordenadaComponent);
    fixture.componentRef.setInput('x', '37.38');
    fixture.componentRef.setInput('y', '-5.97');
    fixture.detectChanges();

    expect(fixture.componentInstance.x()).toBe('37.38');
    expect(fixture.componentInstance.y()).toBe('-5.97');
  });
});
