import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { InstalacionComponent } from './instalacion.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Instalacion } from '../../models/instalacion';

describe('InstalacionComponent', () => {
  let censoServiceMock: {
    mostrarContadores: { set: ReturnType<typeof vi.fn> };
    cargarInstalacion: ReturnType<typeof vi.fn>;
    cargarImagen: ReturnType<typeof vi.fn>;
    cargarRutas: ReturnType<typeof vi.fn>;
    cargarCoordenadasRuta: ReturnType<typeof vi.fn>;
    cargarInstalacionesDeportivas: ReturnType<typeof vi.fn>;
  };
  let activatedRouteMock: { snapshot: { paramMap: ReturnType<typeof convertToParamMap> } };

  const instalacion: Instalacion = {
    id: 1,
    codigo: '410480001',
    nombre: 'Polideportivo Municipal',
    cp: '41390',
    xy_x: '37.38',
    xy_y: '-5.97'
  } as Instalacion;

  beforeEach(() => {
    censoServiceMock = {
      mostrarContadores: { set: vi.fn() },
      cargarInstalacion: vi.fn(),
      cargarImagen: vi.fn(() => of({ message: 'ok', data: [] } as ApiResponse<unknown[]>)),
      cargarRutas: vi.fn(() => of({ message: 'ok', data: [] } as ApiResponse<unknown[]>)),
      cargarCoordenadasRuta: vi.fn(() => of({ message: 'ok', data: [] } as ApiResponse<unknown[]>)),
      cargarInstalacionesDeportivas: vi.fn(() => of({ message: 'ok', data: [] } as ApiResponse<unknown[]>))
    };
    activatedRouteMock = { snapshot: { paramMap: convertToParamMap({ id: '1' }) } };

    TestBed.configureTestingModule({
      imports: [InstalacionComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideRouter([]),
        provideTranslateService(),
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });
  });

  it('oculta los contadores globales y carga la instalación por el id de la ruta', () => {
    censoServiceMock.cargarInstalacion.mockReturnValue(
      of({ message: 'ok', data: instalacion } as ApiResponse<Instalacion>)
    );

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    expect(censoServiceMock.mostrarContadores.set).toHaveBeenCalledWith(false);
    expect(censoServiceMock.cargarInstalacion).toHaveBeenCalledWith('1');
    expect(fixture.componentInstance.instalacion).toEqual(instalacion);
    expect(fixture.componentInstance.cargando).toBe(false);
    expect(fixture.componentInstance.error).toBe(false);
  });

  it('marca noEncontrada y error si la respuesta viene sin datos', () => {
    censoServiceMock.cargarInstalacion.mockReturnValue(
      of({ message: 'ok', data: null } as unknown as ApiResponse<Instalacion>)
    );

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.instalacion).toBeNull();
    expect(fixture.componentInstance.error).toBe(true);
    expect(fixture.componentInstance.noEncontrada).toBe(true);
  });

  it('marca noEncontrada=true solo si el backend responde 404', () => {
    censoServiceMock.cargarInstalacion.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 }))
    );

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.error).toBe(true);
    expect(fixture.componentInstance.noEncontrada).toBe(true);
    expect(fixture.componentInstance.cargando).toBe(false);
  });

  it('marca error pero no noEncontrada en errores distintos de 404', () => {
    censoServiceMock.cargarInstalacion.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.error).toBe(true);
    expect(fixture.componentInstance.noEncontrada).toBe(false);
  });

  it('no llama a cargarInstalacion si no hay id en la ruta', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({});

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarInstalacion).not.toHaveBeenCalled();
  });

  it('mostrarModalCoordenadas guarda x e y', () => {
    censoServiceMock.cargarInstalacion.mockReturnValue(
      of({ message: 'ok', data: instalacion } as ApiResponse<Instalacion>)
    );

    const fixture = TestBed.createComponent(InstalacionComponent);
    fixture.detectChanges();

    fixture.componentInstance.mostrarModalCoordenadas('37.38', '-5.97');
    expect(fixture.componentInstance.coordenadaX).toBe('37.38');
    expect(fixture.componentInstance.coordenadaY).toBe('-5.97');
  });
});
