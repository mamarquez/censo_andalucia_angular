import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import { WidgetComponent } from './widget.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';
import { Municipio } from '../../models/municipio';
import { ActividadDeportiva } from '../../models/actividaddeportiva';

describe('WidgetComponent', () => {
  let censoServiceMock: {
    cargarProvincias: ReturnType<typeof vi.fn>;
    cargarActividadesDeportivas: ReturnType<typeof vi.fn>;
    cargarMunicipios: ReturnType<typeof vi.fn>;
  };

  const provincia: Provincia = { id: 1, ine: '41', nombre: 'Sevilla', activo: true };
  const municipio: Municipio = { id: 10, cpro: '041', cmun: '01', dc: '1', nombre: 'Guadalcanal', activo: true };
  const deporte: ActividadDeportiva = { id: 3, nombre: 'Fútbol', activo: true };

  beforeEach(() => {
    censoServiceMock = {
      cargarProvincias: vi.fn(() => of({ message: 'ok', data: [provincia] } as ApiResponse<Provincia[]>)),
      cargarActividadesDeportivas: vi.fn(() => of({ message: 'ok', data: [deporte] } as ApiResponse<ActividadDeportiva[]>)),
      cargarMunicipios: vi.fn(() => of({ message: 'ok', data: [municipio] } as ApiResponse<Municipio[]>))
    };

    TestBed.configureTestingModule({
      imports: [WidgetComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideRouter([]),
        provideTranslateService()
      ]
    });
  });

  it('carga provincias, municipios y deportes al iniciar, con la opción "todos" primero', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.provincias[0].id).toBeNull();
    expect(fixture.componentInstance.provincias[1]).toEqual(provincia);
    expect(fixture.componentInstance.deportes[0].id).toBeNull();
    expect(fixture.componentInstance.deportes[1]).toEqual(deporte);
    expect(fixture.componentInstance.municipios[0].id).toBeNull();
    expect(fixture.componentInstance.municipios[1]).toEqual(municipio);
    expect(fixture.componentInstance.cargandoProvincias).toBe(false);
    expect(fixture.componentInstance.cargandoMunicipios).toBe(false);
    expect(fixture.componentInstance.cargandoDeportes).toBe(false);
  });

  it('onProvinciaChange resetea municipioSeleccionada y recarga municipios', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();

    fixture.componentInstance.municipioSeleccionada = 10;
    fixture.componentInstance.provinciaSeleccionada = 1;
    fixture.componentInstance.onProvinciaChange();

    expect(fixture.componentInstance.municipioSeleccionada).toBeNull();
    expect(censoServiceMock.cargarMunicipios).toHaveBeenCalled();
  });

  it('cargarMunicipios filtra por el ine de la provincia seleccionada', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();
    censoServiceMock.cargarMunicipios.mockClear();

    fixture.componentInstance.provinciaSeleccionada = 1;
    fixture.componentInstance.cargarMunicipios();

    expect(censoServiceMock.cargarMunicipios).toHaveBeenCalledWith(
      expect.objectContaining({ cpro: '41' })
    );
  });

  it('generarEnlace construye un iframe con los parámetros seleccionados', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();

    fixture.componentInstance.provinciaSeleccionada = 1;
    fixture.componentInstance.municipioSeleccionada = 10;
    fixture.componentInstance.deporteSeleccionada = 3;
    fixture.componentInstance.anchura = 600;
    fixture.componentInstance.altura = 400;
    fixture.componentInstance.generarEnlace();

    expect(fixture.componentInstance.mapa).toContain('<iframe');
    expect(fixture.componentInstance.mapa).toContain('pIdProvincia=1');
    expect(fixture.componentInstance.mapa).toContain('pIdMunicipio=10');
    expect(fixture.componentInstance.mapa).toContain('pIdDeporte=3');
    expect(fixture.componentInstance.mapa).toContain('width="600"');
    expect(fixture.componentInstance.mapa).toContain('height="400"');
  });

  it('generarEnlace usa 480x320 por defecto si anchura/altura son null', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();

    fixture.componentInstance.anchura = null;
    fixture.componentInstance.altura = null;
    fixture.componentInstance.generarEnlace();

    expect(fixture.componentInstance.mapa).toContain('width="480"');
    expect(fixture.componentInstance.mapa).toContain('height="320"');
  });

  it('generarEnlace usa el idioma actual del TranslateService', () => {
    const fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();

    const translateService = TestBed.inject(TranslateService);
    translateService.use('en');

    fixture.componentInstance.generarEnlace();
    expect(fixture.componentInstance.mapa).toContain('pIdIdioma=en');
  });
});
