import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoaderComponent],
      providers: [provideTranslateService()]
    });
  });

  it('cargando por defecto es false', () => {
    const fixture = TestBed.createComponent(LoaderComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBe(false);
  });

  it('acepta cargando=true por @Input', () => {
    const fixture = TestBed.createComponent(LoaderComponent);
    fixture.componentInstance.cargando = true;
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBe(true);
  });
});
