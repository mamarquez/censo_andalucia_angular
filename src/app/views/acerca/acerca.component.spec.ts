import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { AcercaComponent } from './acerca.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Configuracion } from '../../models/configuracion';

describe('AcercaComponent', () => {
  let censoServiceMock: { cargarConfiguraciones: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    censoServiceMock = { cargarConfiguraciones: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AcercaComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        { provide: Router, useValue: {} },
        provideTranslateService()
      ]
    });
  });

  it('carga y sanitiza el HTML de configuración al iniciar', () => {
    const config: Configuracion[] = [{ id: 1, nombre: 'acerca', valor: '<p>Hola</p>', activo: true } as Configuracion];
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: config } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(AcercaComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarConfiguraciones).toHaveBeenCalledWith(fixture.componentInstance.filtros);
    expect(fixture.componentInstance.acerca).not.toBe('');
  });

  it('no cambia acerca si la respuesta viene vacía', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(AcercaComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.acerca).toBe('');
  });

  it('no lanza si cargarConfiguraciones falla', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(AcercaComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.acerca).toBe('');
  });
});
