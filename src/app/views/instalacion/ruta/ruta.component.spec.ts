import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

import { RutaComponent } from './ruta.component';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { InstalacionRuta } from '../../../models/instalacion-ruta';
import { InstalacionRutaCoordenada } from '../../../models/instalacion-ruta-coordenada';

describe('RutaComponent', () => {
  let censoServiceMock: {
    cargarRutas: ReturnType<typeof vi.fn>;
    cargarCoordenadasRuta: ReturnType<typeof vi.fn>;
  };

  const ruta1: InstalacionRuta = {
    id: 1,
    idInstalacion: 10,
    nombre: 'Ruta al infierno',
    descripcion: 'Prueba del infierno',
    distanciaMetros: 8723.39,
    tiempoSenderismoMinutos: 131,
    tiempoRunningMinutos: 52,
    tiempoBttMinutos: 35,
    visible: true
  };

  const ruta2: InstalacionRuta = {
    id: 2,
    idInstalacion: 10,
    nombre: 'Ruta corta',
    descripcion: '',
    tiempoSenderismoMinutos: 20,
    tiempoRunningMinutos: 8,
    tiempoBttMinutos: 5,
    visible: true
  };

  const coordenadasRuta1: InstalacionRutaCoordenada[] = [
    { id: 1, idRuta: 1, x: 37.38, y: -5.97 },
    { id: 2, idRuta: 1, x: 37.39, y: -5.98 }
  ];

  beforeEach(() => {
    censoServiceMock = {
      cargarRutas: vi.fn(),
      cargarCoordenadasRuta: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [RutaComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideTranslateService()
      ]
    });
  });

  it('carga rutas y sus coordenadas cuando cambia idInstalacion', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      of({ message: 'ok', data: [ruta1] } as ApiResponse<InstalacionRuta[]>)
    );
    censoServiceMock.cargarCoordenadasRuta.mockReturnValue(
      of({ message: 'ok', data: coordenadasRuta1 } as ApiResponse<InstalacionRutaCoordenada[]>)
    );

    const fixture = TestBed.createComponent(RutaComponent);
    fixture.componentRef.setInput('idInstalacion', 10);
    fixture.detectChanges();

    expect(censoServiceMock.cargarRutas).toHaveBeenCalledWith(10);
    expect(fixture.componentInstance.rutas()).toEqual([ruta1]);
    expect(fixture.componentInstance.cargando()).toBe(false);
    expect(censoServiceMock.cargarCoordenadasRuta).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.puntosPorRuta()).toEqual({
      1: [
        [37.38, -5.97],
        [37.39, -5.98]
      ]
    });
  });

  it('pide coordenadas por cada ruta devuelta y las indexa por id de ruta', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      of({ message: 'ok', data: [ruta1, ruta2] } as ApiResponse<InstalacionRuta[]>)
    );
    censoServiceMock.cargarCoordenadasRuta.mockImplementation((idRuta: number) =>
      of({
        message: 'ok',
        data: idRuta === 1 ? coordenadasRuta1 : []
      } as ApiResponse<InstalacionRutaCoordenada[]>)
    );

    const fixture = TestBed.createComponent(RutaComponent);
    fixture.componentRef.setInput('idInstalacion', 10);
    fixture.detectChanges();

    expect(censoServiceMock.cargarCoordenadasRuta).toHaveBeenCalledWith(1);
    expect(censoServiceMock.cargarCoordenadasRuta).toHaveBeenCalledWith(2);
    expect(fixture.componentInstance.puntosPorRuta()[2]).toEqual([]);
  });

  it('no llama a cargarCoordenadasRuta cuando no hay rutas', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<InstalacionRuta[]>)
    );

    const fixture = TestBed.createComponent(RutaComponent);
    fixture.componentRef.setInput('idInstalacion', 10);
    fixture.detectChanges();

    expect(fixture.componentInstance.rutas()).toEqual([]);
    expect(fixture.componentInstance.puntosPorRuta()).toEqual({});
    expect(censoServiceMock.cargarCoordenadasRuta).not.toHaveBeenCalled();
  });

  it('deja cargando en false y no lanza si cargarRutas falla', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(RutaComponent);
    fixture.componentRef.setInput('idInstalacion', 10);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.cargando()).toBe(false);
    expect(fixture.componentInstance.rutas()).toEqual([]);
  });

  it('tolera fallo de coordenadas en una ruta sin romper las demás (catchError)', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      of({ message: 'ok', data: [ruta1, ruta2] } as ApiResponse<InstalacionRuta[]>)
    );
    censoServiceMock.cargarCoordenadasRuta.mockImplementation((idRuta: number) =>
      idRuta === 1
        ? of({ message: 'ok', data: coordenadasRuta1 } as ApiResponse<InstalacionRutaCoordenada[]>)
        : throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(RutaComponent);
    fixture.componentRef.setInput('idInstalacion', 10);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.puntosPorRuta()[1]).toEqual([
      [37.38, -5.97],
      [37.39, -5.98]
    ]);
    expect(fixture.componentInstance.puntosPorRuta()[2]).toEqual([]);
  });

  it('urlDescargaKml construye la URL correcta a partir del id de ruta', () => {
    censoServiceMock.cargarRutas.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<InstalacionRuta[]>)
    );

    const fixture = TestBed.createComponent(RutaComponent);
    expect(fixture.componentInstance.urlDescargaKml(7)).toContain('/instalacionesrutas/descargar/7');
  });
});
