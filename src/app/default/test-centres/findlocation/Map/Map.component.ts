import { Component, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef, OnInit, OnChanges } from "@angular/core";
import { latLng, tileLayer, circle, TileLayer, LatLng } from "leaflet";
import * as L from "leaflet";
import "leaflet-draw";

export interface MapData {
  layers?: any;
  options: MapDataOptions;
  markerCluster?: any;
}

export interface MapDataOptions {
  layers?: TileLayer[];
  zoom: number;
  center: LatLng;
}

@Component({
  selector: "app-map",
  template: ` <div [id]="MapName" class="leafletmap" leaflet leafletDraw [leafletOptions]="defaultoptions" [leafletDrawOptions]="drawOptions" [leafletLayers]="inMapData.layers || null" [(leafletZoom)]="zoom" [(leafletCenter)]="center" (leafletMapZoomEnd)="handleMapZoomEnd($event)" (leafletMapMoveEnd)="handleMapCenterEnd($event)" (leafletMapReady)="onMapReady($event)" (leafletDrawStop)="drawStopped($event)"></div> `,
  styles: [],
})
export class MapComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() rerender?: boolean;
  rerendertrigger = false;
  @Input() MapData?: MapData;
  @Input() MapName: any;
  @Input() MapZoom: any;
  zoom: any;
  oldzoom: any;
  @Input() MapCenter: any;
  center: any;
  oldcenter: any;
  fitBounds: any;
  @Output() CenterChange = new EventEmitter();
  @Output() ZoomChange = new EventEmitter();
  @Output() MapChange = new EventEmitter();
  mapreference: any;
  inMapData: any;
  drawOptions = {
    position: "none",
    draw: {
      marker: {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: "assets/images/marker.png",
          // shadowUrl: "assets/images/marker-shadow.png"
        }),
      },
      polyline: false,
      circle: {
        shapeOptions: {
          color: "#aaaaaa",
        },
      },
    },
  };

  get defaultoptions() {
    return (
      this.inMapData.options || {
        layers: [
          tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 12,
            minZoom: 8,
            attribution: "...",
          }),
        ],
        zoom: 10,
        center: latLng(53.789995, -3.024889),
      }
    );
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.MapData) {
      this.inMapData = this.MapData;
      this.oldzoom = this.MapZoom;
      this.oldcenter = this.MapCenter;
      if (this.rerender !== undefined) {
        this.rerendertrigger = this.rerender;
      }
    }
  }

  ngOnChanges() {
    if (this.MapData && this.MapData !== this.inMapData) {
      this.inMapData = this.MapData;
      this.changeDetector.detectChanges();
    }
    if (this.oldzoom !== this.MapZoom) {
      this.updateZoom();
      this.oldzoom = this.MapZoom;
      this.changeDetector.detectChanges();
    }
    if (this.oldcenter !== this.MapCenter) {
      this.updateCenter();
      this.oldcenter = this.MapCenter;
      this.changeDetector.detectChanges();
    }
    if (this.rerender !== undefined && this.rerender !== this.rerendertrigger) {
      this.rerendertrigger = this.rerender;
      setTimeout(() => {
        this.mapreference.invalidateSize();
        this.mapreference._resetView(this.mapreference.getCenter(), this.mapreference.getZoom(), true);
      }, 200);
      this.changeDetector.detectChanges();
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  handleMapZoomEnd(map: L.Map): void {
    if (map) {
      const newValues = {
        zoom: this.zoom,
        center: this.center,
        bounds: this.createPolygonFromBounds(this.mapreference.getBounds()),
      };
      this.ZoomChange.emit(newValues);
    }
  }

  handleMapCenterEnd(event: any): void {
    if (event) {
      if (this.mapreference && this.mapreference.getBounds()) {
        const newValues = {
          zoom: this.zoom,
          center: this.center,
          bounds: this.createPolygonFromBounds(this.mapreference.getBounds()),
        };
        this.CenterChange.emit(newValues);
      }
    }
  }

  createPolygonFromBounds(latLngBounds: any) {
    if (latLngBounds && this.center) {
      const center = this.center;
      const latlngs = [];
      if (latLngBounds.getSouthWest()) {
        latlngs.push(latLngBounds.getSouthWest());
      } // bottom left
      if (latLngBounds.getSouth()) {
        latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng });
      } // bottom center
      if (latLngBounds.getSouthEast()) {
        latlngs.push(latLngBounds.getSouthEast());
      } // bottom right
      if (latLngBounds.getEast()) {
        latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() });
      } // center right
      if (latLngBounds.getNorthEast()) {
        latlngs.push(latLngBounds.getNorthEast());
      } // top right
      if (latLngBounds.getNorth()) {
        latlngs.push({ lat: latLngBounds.getNorth(), lng: center.lng });
      } // top center
      if (latLngBounds.getNorthWest()) {
        latlngs.push(latLngBounds.getNorthWest());
      } // top left
      if (latLngBounds.getWest()) {
        latlngs.push({ lat: center.lat, lng: latLngBounds.getWest() });
      } // center left
      return latlngs;
    }
  }

  onMapReady(map: any) {
    this.mapreference = map;
  }

  updateZoom() {
    if (this.mapreference._zoom !== this.MapZoom) {
      this.zoom = this.MapZoom;
    }
  }

  updateCenter() {
    this.mapreference.panTo(this.MapCenter);
  }

  drawStopped(event: any) {
    console.log(event);
  }
}
