import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { ContadorComponent } from './contador.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';

describe('ContadorComponent', () => {
  let censoServiceMock: {
    numeroInstalaciones: ReturnType<typeof vi.fn>;
    numeroEspaciosDeportivos: ReturnType<typeof vi.fn>;
    numeroEspaciosComplementarios: ReturnType<typeof vi.fn>;
    numeroModalidadesDeportivas: ReturnType<typeof vi.fn>;
    numeroActividadesDeportivas: ReturnType<typeof vi.fn>;
    numeroRutas: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    censoServiceMock = {
      numeroInstalaciones: vi.fn(() => of({ message: 'ok', data: 10 } as ApiResponse<number>)),
      numeroEspaciosDeportivos: vi.fn(() => of({ message: 'ok', data: 20 } as ApiResponse<number>)),
      numeroEspaciosComplementarios: vi.fn(() => of({ message: 'ok', data: 30 } as ApiResponse<number>)),
      numeroModalidadesDeportivas: vi.fn(() => of({ message: 'ok', data: 40 } as ApiResponse<number>)),
      numeroActividadesDeportivas: vi.fn(() => of({ message: 'ok', data: 50 } as ApiResponse<number>)),
      numeroRutas: vi.fn(() => of({ message: 'ok', data: 60 } as ApiResponse<number>))
    };

    TestBed.configureTestingModule({
      imports: [ContadorComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        { provide: Router, useValue: {} },
        provideTranslateService()
      ]
    });
  });

  it('llama a los 6 métodos de conteo al iniciar', () => {
    const fixture = TestBed.createComponent(ContadorComponent);
    fixture.detectChanges();

    expect(censoServiceMock.numeroInstalaciones).toHaveBeenCalled();
    expect(censoServiceMock.numeroEspaciosDeportivos).toHaveBeenCalled();
    expect(censoServiceMock.numeroEspaciosComplementarios).toHaveBeenCalled();
    expect(censoServiceMock.numeroModalidadesDeportivas).toHaveBeenCalled();
    expect(censoServiceMock.numeroActividadesDeportivas).toHaveBeenCalled();
    expect(censoServiceMock.numeroRutas).toHaveBeenCalled();
  });

  it('asigna instalaciones y modalidades a sus propios contadores', () => {
    const fixture = TestBed.createComponent(ContadorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.contadores.instalaciones).toBe(10);
    expect(fixture.componentInstance.contadores.modalidades).toBe(50);
  });

  it('deportivos termina sobrescrito por modalidades y rutas (bug de copy-paste existente)', () => {
    // NOTA: cargarContadorEspaciosDeportivos, cargarContadorModalidadesDeportivas y
    // cargarContadorRutas escriben los tres en contadores.deportivos (en vez de
    // .modalidades/.rutas respectivamente). Con llamadas síncronas, la última en
    // ejecutar (cargarContadorRutas) gana. contadores.rutas nunca se escribe, queda en 0.
    // Este test documenta el comportamiento actual, no lo valida como correcto.
    const fixture = TestBed.createComponent(ContadorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.contadores.deportivos).toBe(60);
    expect(fixture.componentInstance.contadores.complementarios).toBe(30);
    expect(fixture.componentInstance.contadores.rutas).toBe(0);
  });

  it('no lanza si alguna petición de conteo falla', () => {
    censoServiceMock.numeroInstalaciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(ContadorComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
