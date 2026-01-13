import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { LocationModel } from '../../../../../../core/location/location-model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-location-picker-component',
  imports: [],
  templateUrl: './map-location-picker-component.html',
  styleUrl: './map-location-picker-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapLocationPickerComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  @Input() initialCenter: LocationModel | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<LocationModel>();

  // the selected location
  lat: number | null = null;
  lng: number | null = null;

  markerPosition: { lat: number; lng: number } | null = null;

  private map!: L.Map;
  private marker: L.Marker | null = null;

  // Default start (Cairo)
  private readonly fallbackCenter: L.LatLngExpression = [30.0444, 31.2357];
  private readonly pickedZoom = 15;

  ngAfterViewInit(): void {
    // Delay initialization to avoid ExpressionChangedAfterItHasBeenCheckedError
    console.log(
      'MapLocationPickerComponent: ngAfterViewInit: Initial Center:',
      this.initialCenter
    );
    queueMicrotask(() => {
      {
        this.initMap();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    const el = document.getElementById('map');
    if (!el) return;

    const center: L.LatLngExpression = this.initialCenter
      ? [this.initialCenter.lat, this.initialCenter.lng]
      : this.fallbackCenter;

    console.log('MapLocationPickerComponent: initMap: Initial Center:', center);

    const zoom = this.pickedZoom;

    this.map = L.map(el, { zoomControl: true }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // if the user has already selected a location, set the pin on the map
    if (this.initialCenter) {
      this.setPin(this.initialCenter.lat, this.initialCenter.lng);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setPin(e.latlng.lat, e.latlng.lng);
    });

    this.cdr.detectChanges();

    setTimeout(() => this.map.invalidateSize(), 10);
  }

  private setPin(lat: number, lng: number): void {
    const fixedLat = +lat.toFixed(6);
    const fixedLng = +lng.toFixed(6);

    console.log(
      `MapLocationPickerComponent: setPin: lat: ${fixedLat}, lng:${fixedLng} `
    );

    this.lat = fixedLat;
    this.lng = fixedLng;
    this.markerPosition = { lat: fixedLat, lng: fixedLng };

    if (!this.marker) {
      console.log(
        'MapLocationPickerComponent: setPin: there is no marker, adding new marker'
      );
      this.marker = L.marker([fixedLat, fixedLng], { draggable: true }).addTo(
        this.map
      );

      this.marker.on('dragend', () => {
        const p = this.marker!.getLatLng();
        this.setPin(p.lat, p.lng);
      });
    } else {
      console.log(
        'MapLocationPickerComponent: setPin: there is a marker, moving it'
      );
      this.marker.setLatLng([fixedLat, fixedLng]);
    }
    this.cdr.detectChanges();
  }

  resetPin(): void {
    if (this.initialCenter) {
      this.setPin(this.initialCenter.lat, this.initialCenter.lng);
      this.map.setView(
        [this.initialCenter.lat, this.initialCenter.lng],
        this.pickedZoom
      );
      return;
    }

    // fallback
    this.lat = null;
    this.lng = null;
    this.markerPosition = null;

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    this.map.setView(this.fallbackCenter, this.pickedZoom);
  }

  confirm(): void {
    if (!this.markerPosition) return;
    const location: LocationModel = {
      lat: this.markerPosition.lat,
      lng: this.markerPosition.lng,
      settingDate: new Date(),
    };
    this.confirmed.emit(location);
    this.closeModal();
  }

  closeModal(): void {
    this.closed.emit();
  }
}
