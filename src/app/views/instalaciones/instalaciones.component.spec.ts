import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideTranslateService } from '@ngx-translate/core';

import { InstalacionesComponent } from './instalaciones.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Instalacion } from '../../models/instalacion';

describe('InstalacionesComponent', () => {
  let censoServiceMock: {
    cargarInstalaciones: ReturnType<typeof vi.fn>;
    exportarInstalacionesExcel: ReturnType<typeof vi.fn>;
  };
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };

  const instalacion: Instalacion = { id: 1, codigo: 'C1', nombre: 'Polideportivo', cp: '41000' } as Instalacion;

  beforeEach(() => {
    censoServiceMock = {
      cargarInstalaciones: vi.fn(() => of({ message: 'ok', data: [instalacion] } as ApiResponse<Instalacion[]>)),
      exportarInstalacionesExcel: vi.fn()
    };
    messageServiceMock = { add: vi.fn() };
    activatedRouteMock = { snapshot: { queryParamMap: convertToParamMap({}) } };

    TestBed.configureTestingModule({
      imports: [InstalacionesComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        provideRouter([]),
        provideTranslateService(),
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });
  });

  it('carga instalaciones al iniciar sin query params', () => {
    const fixture = TestBed.createComponent(InstalacionesComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarInstalaciones).toHaveBeenCalled();
    expect(fixture.componentInstance.instalaciones).toEqual([instalacion]);
    expect(fixture.componentInstance.cargando).toBe(false);
    expect(fixture.componentInstance.error).toBe(false);
  });

  it('lee los query params de la ruta y los vuelca en filtros y modeloBusqueda', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      nombre: 'Piscina',
      provincia: '1',
      municipio: '10',
      deporte: '3',
      claseInstalacion: 'A',
      nivelDotacion: '2'
    });

    const fixture = TestBed.createComponent(InstalacionesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.filtros.nombre).toBe('Piscina');
    expect(fixture.componentInstance.filtros.provincia).toBe(1);
    expect(fixture.componentInstance.filtros.municipio).toBe(10);
    expect(fixture.componentInstance.filtros.deporte).toBe(3);
    expect(fixture.componentInstance.filtros.claseInstalacion).toBe('A');
    expect(fixture.componentInstance.filtros.nivelDotacion).toBe(2);
    expect(fixture.componentInstance.modeloBusqueda.nombreInstalacion).toBe('Piscina');
  });

  it('marca error y vacía instalaciones si cargarInstalaciones falla', () => {
    censoServiceMock.cargarInstalaciones.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(InstalacionesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.error).toBe(true);
    expect(fixture.componentInstance.instalaciones).toEqual([]);
    expect(fixture.componentInstance.cargando).toBe(false);
  });

  it('descargarExcel dispara la descarga del blob', () => {
    const blob = new Blob(['contenido'], { type: 'application/vnd.ms-excel' });
    censoServiceMock.exportarInstalacionesExcel.mockReturnValue(of(blob));

    const createObjectURL = vi.fn(() => 'blob:fake-url');
    const revokeObjectURL = vi.fn();
    Object.assign(window.URL, { createObjectURL, revokeObjectURL });

    const fixture = TestBed.createComponent(InstalacionesComponent);
    fixture.detectChanges();

    fixture.componentInstance.descargarExcel();

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');
  });

  it('descargarExcel notifica error por MessageService si falla', () => {
    censoServiceMock.exportarInstalacionesExcel.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(InstalacionesComponent);
    fixture.detectChanges();

    fixture.componentInstance.descargarExcel();

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' })
    );
  });
});
