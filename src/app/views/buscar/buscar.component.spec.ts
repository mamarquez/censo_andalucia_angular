import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { BuscarComponent } from './buscar.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';
import { Municipio } from '../../models/municipio';
import { ActividadDeportiva } from '../../models/actividaddeportiva';

describe('BuscarComponent', () => {
  let censoServiceMock: {
    cargarProvincias: ReturnType<typeof vi.fn>;
    cargarActividadesDeportivas: ReturnType<typeof vi.fn>;
    cargarNivelesDotacion: ReturnType<typeof vi.fn>;
    cargarMunicipios: ReturnType<typeof vi.fn>;
  };

  const provincia: Provincia = { id: 1, ine: '41', nombre: 'Sevilla', activo: true };
  const municipio: Municipio = { id: 10, cpro: '041', cmun: '01', dc: '1', nombre: 'Guadalcanal', activo: true };
  const deporte: ActividadDeportiva = { id: 3, nombre: 'Fútbol', activo: true };

  beforeEach(() => {
    censoServiceMock = {
      cargarProvincias: vi.fn(() => of({ message: 'ok', data: [provincia] } as ApiResponse<Provincia[]>)),
      cargarActividadesDeportivas: vi.fn(() => of({ message: 'ok', data: [deporte] } as ApiResponse<ActividadDeportiva[]>)),
      cargarNivelesDotacion: vi.fn(() => of({ message: 'ok', data: [] } as ApiResponse<unknown[]>)),
      cargarMunicipios: vi.fn(() => of({ message: 'ok', data: [municipio] } as ApiResponse<Municipio[]>))
    };

    TestBed.configureTestingModule({
      imports: [BuscarComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideRouter([]),
        provideTranslateService()
      ]
    });
  });

  it('carga provincias y deportes al iniciar', () => {
    const fixture = TestBed.createComponent(BuscarComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.provincias).toEqual([{ valor: 1, etiqueta: 'Sevilla' }]);
    expect(fixture.componentInstance.deportes).toEqual([{ valor: 3, etiqueta: 'Fútbol' }]);
  });

  it('onProvinciaChange con cadena vacía limpia municipio sin llamar al backend', () => {
    const fixture = TestBed.createComponent(BuscarComponent);
    fixture.detectChanges();
    censoServiceMock.cargarMunicipios.mockClear();

    fixture.componentInstance.modelo.municipio = '5';
    fixture.componentInstance.onProvinciaChange('');

    expect(fixture.componentInstance.modelo.municipio).toBe('');
    expect(censoServiceMock.cargarMunicipios).not.toHaveBeenCalled();
  });

  it('onProvinciaChange con id carga municipios de esa provincia', () => {
    const fixture = TestBed.createComponent(BuscarComponent);
    fixture.detectChanges();

    fixture.componentInstance.onProvinciaChange(1);

    expect(censoServiceMock.cargarMunicipios).toHaveBeenCalledWith(
      expect.objectContaining({ idProvincia: 1 })
    );
    expect(fixture.componentInstance.municipios).toEqual([{ valor: 10, etiqueta: 'Guadalcanal' }]);
  });

  it('buscar navega a /instalaciones con todos los criterios del formulario', () => {
    const fixture = TestBed.createComponent(BuscarComponent);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.modelo.nombre = '  Piscina  ';
    fixture.componentInstance.modelo.provincia = '1';
    fixture.componentInstance.buscar();

    expect(navigateSpy).toHaveBeenCalledWith(['/instalaciones'], {
      queryParams: expect.objectContaining({ nombre: 'Piscina', provincia: 1 })
    });
  });

  it('limpiar resetea el modelo y los municipios', () => {
    const fixture = TestBed.createComponent(BuscarComponent);
    fixture.detectChanges();

    fixture.componentInstance.modelo.nombre = 'algo';
    fixture.componentInstance.municipios = [{ valor: 1, etiqueta: 'x' }];
    fixture.componentInstance.limpiar();

    expect(fixture.componentInstance.modelo.nombre).toBe('');
    expect(fixture.componentInstance.municipios).toEqual([]);
  });
});
