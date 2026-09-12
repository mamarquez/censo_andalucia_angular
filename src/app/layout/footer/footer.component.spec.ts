import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { FooterComponent } from './footer.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Configuracion } from '../../models/configuracion';

describe('FooterComponent', () => {
  let censoServiceMock: { cargarConfiguraciones: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    censoServiceMock = { cargarConfiguraciones: vi.fn() };

    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideRouter([]),
        provideTranslateService()
      ]
    });
  });

  it('actualiza version con el valor devuelto por el backend', () => {
    const config: Configuracion[] = [{ id: 1, nombre: 'version', valor: '2.3.4', activo: true } as Configuracion];
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: config } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.version).toBe('2.3.4');
  });

  it('usa "1.0.0" si el valor del backend viene vacío', () => {
    const config: Configuracion[] = [{ id: 1, nombre: 'version', valor: '', activo: true } as Configuracion];
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: config } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.version).toBe('1.0.0');
  });

  it('mantiene la version del environment si la respuesta viene vacía', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<Configuracion[]>)
    );

    const fixture = TestBed.createComponent(FooterComponent);
    const versionInicial = fixture.componentInstance.version;
    fixture.detectChanges();

    expect(fixture.componentInstance.version).toBe(versionInicial);
  });

  it('no lanza si cargarConfiguraciones falla', () => {
    censoServiceMock.cargarConfiguraciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(FooterComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('anio es el año actual', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance.anio).toBe(new Date().getFullYear());
  });
});
