import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

import { DeportivaInstalacionComponent } from './deportiva.component';
import { CensoService } from '../../../services/censoService.service';
import { ApiResponse } from '../../../models/apiresponse';
import { InstalacionEspacioDeportivo } from '../../../models/instalacion-espacio-deportivo';

describe('DeportivaInstalacionComponent', () => {
  let censoServiceMock: { cargarInstalacionesDeportivas: ReturnType<typeof vi.fn> };

  const espacio: InstalacionEspacioDeportivo = {
    id: 1,
    idInstalacion: 5,
    nombre: 'Espacio_01',
    descripcion: 'Descripción',
    visible: true
  } as InstalacionEspacioDeportivo;

  beforeEach(() => {
    censoServiceMock = { cargarInstalacionesDeportivas: vi.fn() };

    TestBed.configureTestingModule({
      imports: [DeportivaInstalacionComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideTranslateService()
      ]
    });
  });

  it('carga espacios deportivos cuando cambia idInstalacion', () => {
    censoServiceMock.cargarInstalacionesDeportivas.mockReturnValue(
      of({ message: 'ok', data: [espacio] } as ApiResponse<InstalacionEspacioDeportivo[]>)
    );

    const fixture = TestBed.createComponent(DeportivaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);
    fixture.detectChanges();

    expect(censoServiceMock.cargarInstalacionesDeportivas).toHaveBeenCalledWith(5);
    expect(fixture.componentInstance.espacios()).toEqual([espacio]);
    expect(fixture.componentInstance.cargando()).toBe(false);
  });

  it('deja espacios vacío si la respuesta no trae datos', () => {
    censoServiceMock.cargarInstalacionesDeportivas.mockReturnValue(
      of({ message: 'ok', data: [] } as ApiResponse<InstalacionEspacioDeportivo[]>)
    );

    const fixture = TestBed.createComponent(DeportivaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);
    fixture.detectChanges();

    expect(fixture.componentInstance.espacios()).toEqual([]);
  });

  it('no lanza y deja cargando en false si falla', () => {
    censoServiceMock.cargarInstalacionesDeportivas.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    const fixture = TestBed.createComponent(DeportivaInstalacionComponent);
    fixture.componentRef.setInput('idInstalacion', 5);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.cargando()).toBe(false);
  });

  it('no llama al servicio si idInstalacion no está definido', () => {
    const fixture = TestBed.createComponent(DeportivaInstalacionComponent);
    fixture.detectChanges();

    expect(censoServiceMock.cargarInstalacionesDeportivas).not.toHaveBeenCalled();
  });
});
