import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { PlanesLocalesComponent } from './planes-locales.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Configuracion } from '../../models/configuracion';

describe('PlanesLocalesComponent', () => {
  let censoServiceMock: { cargarConfiguraciones: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    censoServiceMock = { cargarConfiguraciones: vi.fn() };

    TestBed.configureTestingModule({
      imports: [PlanesLocalesComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        { provide: Router, useValue: {} },
        provideTranslateService()
      ]
    });
  });

  it('carga y sanitiza el HTML de planes al iniciar', () => {
    const config: Configuracion[] = [{ id: 1, nombre: 'planes', valor: '<p>Planes</p>', activo: true } as Configuracion];
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: config } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(PlanesLocalesComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarConfiguraciones).toHaveBeenCalledWith(fixture.componentInstance.filtros);
    expect(fixture.componentInstance.planes).not.toBe('');
  });

  it('no cambia planes si la respuesta viene vacía', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(PlanesLocalesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.planes).toBe('');
  });

  it('no lanza si cargarConfiguraciones falla', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(PlanesLocalesComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.planes).toBe('');
  });
});
