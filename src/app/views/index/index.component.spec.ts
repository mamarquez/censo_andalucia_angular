import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

// El componente registra el custom element <swiper-container> con register(); en jsdom
// su connectedCallback real revienta (no hay soporte completo de Shadow DOM/Swiper core).
// Se mockea para que sea un no-op y <swiper-container> quede como elemento inerte.
vi.mock('swiper/element/bundle', () => ({ register: () => {} }));

import { InicioComponent } from './index.component';
import { CensoService } from '../../services/censoService.service';
import { ApiResponse } from '../../models/apiresponse';
import { Provincia } from '../../models/provincia';
import { Municipio } from '../../models/municipio';
import { ActividadDeportiva } from '../../models/actividaddeportiva';
import { NivelDotacion } from '../../models/niveldotacion';

describe('InicioComponent', () => {
  let censoServiceMock: {
    cargarProvincias: ReturnType<typeof vi.fn>;
    cargarActividadesDeportivas: ReturnType<typeof vi.fn>;
    cargarNivelesDotacion: ReturnType<typeof vi.fn>;
    cargarMunicipios: ReturnType<typeof vi.fn>;
  };

  const provincia: Provincia = { id: 1, ine: '41', nombre: 'Sevilla', activo: true };
  const municipio: Municipio = { id: 10, cpro: '041', cmun: '01', dc: '1', nombre: 'Guadalcanal', activo: true };
  const deporte: ActividadDeportiva = { id: 3, nombre: 'Fútbol', activo: true };
  const nivel: NivelDotacion = { id: 2, nombre: 'Básico', activo: true };

  beforeEach(() => {
    censoServiceMock = {
      cargarProvincias: vi.fn(() => of({ message: 'ok', data: [provincia] } as ApiResponse<Provincia[]>)),
      cargarActividadesDeportivas: vi.fn(() => of({ message: 'ok', data: [deporte] } as ApiResponse<ActividadDeportiva[]>)),
      cargarNivelesDotacion: vi.fn(() => of({ message: 'ok', data: [nivel] } as ApiResponse<NivelDotacion[]>)),
      cargarMunicipios: vi.fn(() => of({ message: 'ok', data: [municipio] } as ApiResponse<Municipio[]>))
    };

    TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideRouter([]),
        provideTranslateService()
      ]
    });
  });

  it('carga provincias, deportes y niveles de dotación al iniciar', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.provincias).toEqual([{ valor: 1, etiqueta: 'Sevilla' }]);
    expect(fixture.componentInstance.deportes).toEqual([{ valor: 3, etiqueta: 'Fútbol' }]);
    expect(fixture.componentInstance.nivelDotacionOpciones).toEqual([{ valor: 2, etiqueta: 'Básico' }]);
  });

  it('alternarAvanzada invierte busquedaAvanzada', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.busquedaAvanzada).toBe(false);
    fixture.componentInstance.alternarAvanzada();
    expect(fixture.componentInstance.busquedaAvanzada).toBe(true);
  });

  it('onProvinciaChange con null limpia municipio y no llama al backend', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();
    censoServiceMock.cargarMunicipios.mockClear();

    fixture.componentInstance.modeloBusqueda.municipio = '5';
    fixture.componentInstance.onProvinciaChange(null);

    expect(fixture.componentInstance.modeloBusqueda.municipio).toBe('');
    expect(fixture.componentInstance.municipios).toEqual([]);
    expect(censoServiceMock.cargarMunicipios).not.toHaveBeenCalled();
  });

  it('onProvinciaChange con un id carga los municipios de esa provincia', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();

    fixture.componentInstance.onProvinciaChange(1);

    expect(censoServiceMock.cargarMunicipios).toHaveBeenCalledWith(
      expect.objectContaining({ idProvincia: 1, activo: true })
    );
    expect(fixture.componentInstance.municipios).toEqual([{ valor: 10, etiqueta: 'Guadalcanal' }]);
    expect(fixture.componentInstance.cargandoMunicipios).toBe(false);
  });

  it('buscar navega a /instalaciones con los criterios del formulario', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.modeloBusqueda.nombreInstalacion = '  Piscina  ';
    fixture.componentInstance.modeloBusqueda.provincia = '1';
    fixture.componentInstance.modeloBusqueda.municipio = '10';
    fixture.componentInstance.buscar();

    expect(navigateSpy).toHaveBeenCalledWith(['/instalaciones'], {
      queryParams: expect.objectContaining({
        nombre: 'Piscina',
        provincia: 1,
        municipio: 10
      })
    });
  });
});
