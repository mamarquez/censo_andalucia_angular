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
 * Mapa Leaflet + OpenStreetMap con un único marcador, o con una polilínea de ruta.
 *
 * <p>Se le pasan `lat`/`lng` (coordenadas decimales) y opcionalmente un `titulo`
 * para el popup. Si no hay coordenadas válidas no renderiza nada.</p>
 *
 * <p>Si además se le pasa `puntos` (lista de coordenadas `[lat, lng]`), se dibuja
 * una polilínea con esos puntos y el mapa se encuadra a su extensión (`lat`/`lng`
 * dejan de usarse como centro en ese caso).</p>
 *
 * <pre>
 * &lt;app-mapa [lat]="37.38" [lng]="-5.97" [titulo]="instalacion.nombre"&gt;&lt;/app-mapa&gt;
 * &lt;app-mapa [puntos]="ruta.puntos" [titulo]="ruta.nombre"&gt;&lt;/app-mapa&gt;
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

  /** Si es `false`, deshabilita por completo el zoom interactivo (rueda, doble-click, teclado, pellizco y los botones +/-). */
  @Input() zoomInteractivo = true;

  /**
   * Puntos `[lat, lng]` del trazado de una ruta. Si se informa (con 2 o más puntos),
   * se dibuja como polilínea y el mapa se encuadra a su extensión, ignorando `lat`/`lng`
   * como centro.
   */
  @Input() puntos: Array<[number, number]> | null | undefined;

  @ViewChild('mapa', { static: true }) private readonly contenedor!: ElementRef<HTMLElement>;

  private mapa?: L.Map;
  private marcador?: L.Marker;
  private polilinea?: L.Polyline;
  private iniciado = false;

  ngAfterViewInit(): void {
    this.iniciado = true;
    this.render();
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (this.iniciado && (cambios['lat'] || cambios['lng'] || cambios['puntos'])) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }

  private render(): void {
    if (this.puntos && this.puntos.length >= 2) {
      this.renderRuta(this.puntos);
      return;
    }

    this.renderPunto();
  }

  private renderPunto(): void {
    const lat = this.aNumero(this.lat);
    const lng = this.aNumero(this.lng);

    if (lat === null || lng === null) {
      this.mapa?.remove();
      this.mapa = undefined;
      return;
    }

    this.asegurarMapa([lat, lng]);
    this.mapa!.setView([lat, lng], this.zoom);

    this.polilinea?.remove();
    this.polilinea = undefined;

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
      this.marcador = L.marker([lat, lng], { icon: icono }).addTo(this.mapa!);
    }

    if (this.titulo) {
      this.marcador.bindPopup(this.titulo);
    }

    this.invalidarTamano();
  }

  private renderRuta(puntos: Array<[number, number]>): void {
    this.asegurarMapa(puntos[0]);

    this.marcador?.remove();
    this.marcador = undefined;

    if (this.polilinea) {
      this.polilinea.setLatLngs(puntos);
    } else {
      this.polilinea = L.polyline(puntos, { color: '#1a7a3c', weight: 4 }).addTo(this.mapa!);
    }

    if (this.titulo) {
      this.polilinea.bindPopup(this.titulo);
    }

    this.mapa!.fitBounds(this.polilinea.getBounds(), { padding: [20, 20] });

    this.invalidarTamano();
  }

  private asegurarMapa(centroInicial: [number, number]): void {
    if (this.mapa) {
      return;
    }

    this.mapa = L.map(this.contenedor.nativeElement, {
      center: centroInicial,
      zoom: this.zoom,
      scrollWheelZoom: this.scrollWheelZoom,
      zoomControl: this.zoomInteractivo,
      doubleClickZoom: this.zoomInteractivo,
      boxZoom: this.zoomInteractivo,
      touchZoom: this.zoomInteractivo,
      keyboard: this.zoomInteractivo
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.mapa);
  }

  private invalidarTamano(): void {
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
