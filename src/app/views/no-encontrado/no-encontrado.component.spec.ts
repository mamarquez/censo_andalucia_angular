import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

import { NoEncontradoComponent } from './no-encontrado.component';

describe('NoEncontradoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoEncontradoComponent],
      providers: [provideTranslateService(), provideRouter([])]
    });
  });

  it('se crea sin lanzar', () => {
    const fixture = TestBed.createComponent(NoEncontradoComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
