import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { InformacionLegalComponent } from './informacion-legal.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Configuracion } from '../../models/configuracion';

describe('InformacionLegalComponent', () => {
  let censoServiceMock: { cargarConfiguraciones: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    censoServiceMock = { cargarConfiguraciones: vi.fn() };

    TestBed.configureTestingModule({
      imports: [InformacionLegalComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        { provide: Router, useValue: {} },
        provideTranslateService()
      ]
    });
  });

  it('carga avisoLegal y privacidad, y pone cargando en false', () => {
    const config: Configuracion[] = [{ id: 1, nombre: 'x', valor: '<p>texto</p>', activo: true } as Configuracion];
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: config } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(InformacionLegalComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarConfiguraciones).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.avisoLegal).not.toBe('');
    expect(fixture.componentInstance.privacidad).not.toBe('');
    expect(fixture.componentInstance.cargando).toBe(false);
  });

  it('no lanza si cargarConfiguraciones falla y deja cargando en false', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(InformacionLegalComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.cargando).toBe(false);
    expect(fixture.componentInstance.avisoLegal).toBe('');
    expect(fixture.componentInstance.privacidad).toBe('');
  });
});
