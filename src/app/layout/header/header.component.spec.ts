import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';

import { HeaderComponent } from './header.component';
import { CensoService } from '../../services/censoService.service';

describe('HeaderComponent', () => {
  let censoServiceMock: { menuAbierto: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    censoServiceMock = { menuAbierto: signal(false) };

    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideTranslateService()
      ]
    });
  });

  it('toggleMenu invierte censoService.menuAbierto', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    fixture.componentInstance.toggleMenu();
    expect(censoServiceMock.menuAbierto()).toBe(true);

    fixture.componentInstance.toggleMenu();
    expect(censoServiceMock.menuAbierto()).toBe(false);
  });

  it('cambiarIdioma llama a translateService.use con el idioma dado', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const translateService = TestBed.inject(TranslateService);
    let idiomaUsado: string | undefined;
    translateService.use = (idioma: string) => {
      idiomaUsado = idioma;
      return undefined as never;
    };

    fixture.componentInstance.cambiarIdioma('en');
    expect(idiomaUsado).toBe('en');
  });
});
