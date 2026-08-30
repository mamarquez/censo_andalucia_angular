import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';

/**
 * Mapa Leaflet + OpenStreetMap con un único marcador.
 *
 * <p>Se le pasan `lat`/`lng` (coordenadas decimales) y opcionalmente un `titulo`
 * para el popup. Si no hay coordenadas válidas no renderiza nada.</p>
 *
 * <pre>
 * &lt;app-mapa [lat]="37.38" [lng]="-5.97" [titulo]="instalacion.nombre"&gt;&lt;/app-mapa&gt;
 * </pre>
 *
 * @author Duncan
 * @version 1.0.0
 */
@Component({
  standalone: true,
  selector: 'app-mapa',
  template: '<div #mapa class="mapa-contenedor"></div>',
  styles: [`
    :host { display: block; width: 100%; }
    .mapa-contenedor { width: 100%; height: 100%; min-height: inherit; }
  `]
})
export class MapaComponent implements AfterViewInit, OnChanges, OnDestroy {

  /** Latitud en grados decimales. */
  @Input() lat: number | string | null | undefined;

  /** Longitud en grados decimales. */
  @Input() lng: number | string | null | undefined;

  /** Texto del popup del marcador. */
  @Input() titulo = '';

  /** Nivel de zoom inicial (0 = mundo, 19 = máximo detalle en OSM). */
  @Input() zoom = 17;

  /** Permitir zoom con la rueda del ratón. */
  @Input() scrollWheelZoom = true;

  @ViewChild('mapa', { static: true }) private contenedor!: ElementRef<HTMLElement>;

  private mapa?: L.Map;
  private marcador?: L.Marker;
  private iniciado = false;

  ngAfterViewInit(): void {
    this.iniciado = true;
    this.render();
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (this.iniciado && (cambios['lat'] || cambios['lng'])) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }

  private render(): void {
    const lat = this.aNumero(this.lat);
    const lng = this.aNumero(this.lng);

    if (lat === null || lng === null) {
      this.mapa?.remove();
      this.mapa = undefined;
      return;
    }

    if (!this.mapa) {
      this.mapa = L.map(this.contenedor.nativeElement, {
        center: [lat, lng],
        zoom: this.zoom,
        scrollWheelZoom: this.scrollWheelZoom
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(this.mapa);
    } else {
      this.mapa.setView([lat, lng], this.zoom);
    }

    const icono = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    if (this.marcador) {
      this.marcador.setLatLng([lat, lng]);
    } else {
      this.marcador = L.marker([lat, lng], { icon: icono }).addTo(this.mapa);
    }

    if (this.titulo) {
      this.marcador.bindPopup(this.titulo);
    }

    // El contenedor puede haberse dimensionado después de crear el mapa.
    setTimeout(() => this.mapa?.invalidateSize(), 0);
  }

  private aNumero(valor: number | string | null | undefined): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }
    const n = typeof valor === 'number' ? valor : Number(valor);
    return Number.isFinite(n) ? n : null;
  }
}
