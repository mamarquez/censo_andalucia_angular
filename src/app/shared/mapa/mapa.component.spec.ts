import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { MapaComponent } from './mapa.component';

describe('MapaComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MapaComponent]
    });
  });

  it('no crea mapa si no hay lat/lng ni puntos', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.classList.contains('leaflet-container')).toBe(false);
  });

  it('crea un mapa con marcador cuando hay lat/lng válidos', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('lat', 37.38);
    fixture.componentRef.setInput('lng', -5.97);
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.classList.contains('leaflet-container')).toBe(true);
    expect(contenedor.querySelector('.leaflet-marker-icon')).not.toBeNull();
  });

  it('acepta lat/lng como string numérico', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('lat', '37.38');
    fixture.componentRef.setInput('lng', '-5.97');
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.querySelector('.leaflet-marker-icon')).not.toBeNull();
  });

  it('ignora lat/lng no numéricos', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('lat', 'no-es-un-numero');
    fixture.componentRef.setInput('lng', -5.97);
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.querySelector('.leaflet-container')).toBeNull();
  });

  it('dibuja una polilínea cuando se pasan 2 o más puntos', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('puntos', [
      [37.38, -5.97],
      [37.39, -5.98]
    ]);
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.querySelector('.leaflet-marker-icon')).toBeNull();
    expect(contenedor.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('vuelve a renderizar como punto si puntos pasa a tener menos de 2 elementos', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('lat', 37.38);
    fixture.componentRef.setInput('lng', -5.97);
    fixture.componentRef.setInput('puntos', [
      [37.38, -5.97],
      [37.39, -5.98]
    ]);
    fixture.detectChanges();

    fixture.componentRef.setInput('puntos', []);
    fixture.detectChanges();

    const contenedor: HTMLElement = fixture.nativeElement.querySelector('.mapa-contenedor');
    expect(contenedor.querySelector('.leaflet-marker-icon')).not.toBeNull();
  });

  it('ngOnDestroy no lanza tras crear el mapa', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.componentRef.setInput('lat', 37.38);
    fixture.componentRef.setInput('lng', -5.97);
    fixture.detectChanges();

    expect(() => fixture.destroy()).not.toThrow();
  });
});
