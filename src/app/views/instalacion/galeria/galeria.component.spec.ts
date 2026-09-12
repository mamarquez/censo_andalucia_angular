import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

import { GaleroaInstalacionComponent } from './galeria.component';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { InstalacionImagen } from '../../../models/instalacion-imagen';

describe('GaleroaInstalacionComponent', () => {
  let censoServiceMock: { cargarImagen: ReturnType<typeof vi.fn> };

  const imagen: InstalacionImagen = {
    id: 1,
    idInstalacion: 5,
    nombre: 'foto.jpg',
    url: '',
    descripcion: 'Fachada',
    visible: true
  };

  beforeEach(() => {
    censoServiceMock = { cargarImagen: vi.fn() };

    TestBed.configureTestingModule({
      imports: [GaleroaInstalacionComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideTranslateService()
      ]
    });
  });

  it('carga imágenes y reescribe la url contra el endpoint de imágenes', () => {
    censoServiceMock.cargarImagen.mockReturnValue(
      of({ message: 'ok', data: [imagen] } as ApiResponse<InstalacionImagen[]>)
    );

    const fixture = TestBed.createComponent(GaleroaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);
    fixture.detectChanges();

    expect(censoServiceMock.cargarImagen).toHaveBeenCalledWith(5);
    expect(fixture.componentInstance.cargando()).toBe(false);
    expect(fixture.componentInstance.imagenes()).toHaveLength(1);
    expect(fixture.componentInstance.imagenes()[0].url).toContain('/instalacionesgaleria/images/foto.jpg');
  });

  it('deja imagenes vacío si la respuesta no trae datos', () => {
    censoServiceMock.cargarImagen.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<InstalacionImagen[]>)
    );

    const fixture = TestBed.createComponent(GaleroaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);
    fixture.detectChanges();

    expect(fixture.componentInstance.imagenes()).toEqual([]);
  });

  it('no lanza y deja cargando en false si cargarImagen falla', () => {
    censoServiceMock.cargarImagen.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(GaleroaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.cargando()).toBe(false);
  });

  it('no llama a cargarImagen si idInstalacion no está definido', () => {
    const fixture = TestBed.createComponent(GaleroaInstalacionComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarImagen).not.toHaveBeenCalled();
  });
});
