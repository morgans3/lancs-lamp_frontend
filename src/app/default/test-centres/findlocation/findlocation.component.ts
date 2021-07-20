import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges } from "@angular/core";
import { FormGroup, FormControl, FormGroupDirective } from "@angular/forms";
import { latLng, tileLayer, TileLayer, LatLng } from "leaflet";
import * as L from "leaflet";
import { PostcodeService } from "../../../_services/postcodes.service";
import { NotificationService } from "../../../_services/notification.service";
import { Address } from "../../../_models/lamp";

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
  selector: "app-findlocation",
  templateUrl: "./findlocation.component.html",
  styleUrls: ["./findlocation.component.scss"],
})
export class FindlocationComponent implements OnInit, OnChanges {
  @Input() read?: Address;
  mapHeight = { height: "40vh" };
  mapStyle = { display: "block" };
  mapRender = false;
  MapCenter = latLng(53.839268, -2.542037);
  MapZoom = 8;
  MapBounds: any;
  pinGroup: any;
  MapData: MapData = {
    options: {
      layers: [
        tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          minZoom: 8,
          attribution: "...",
        }),
      ],
      zoom: 8,
      center: latLng(53.839268, -2.542037),
    },
    layers: [],
  };
  @Output() updated = new EventEmitter<Address>();
  locationForm = new FormGroup({
    postcode: new FormControl(null, null),
    addressline1: new FormControl(null, null),
    addressline2: new FormControl(null, null),
    addressline3: new FormControl(null, null),
    addressline4: new FormControl(null, null),
    addressline5: new FormControl(null, null),
    name: new FormControl(null, null),
    lat: new FormControl(null, null),
    lng: new FormControl(null, null),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  selectedLocation: any;
  location: any;

  constructor(private postcodeService: PostcodeService, private notificationService: NotificationService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.read && this.read.postcode) {
      if (this.read.postcode !== this.locationForm.controls.postcode.value) {
        this.locationForm.patchValue(this.read);
        this.findLocation();
      }
    }
  }

  findLocation() {
    const postcode = this.locationForm.controls.postcode.value.toString();
    if (postcode) {
      this.postcodeService.getByPostcode(postcode.split(" ").join("").toLowerCase()).subscribe((data: any) => {
        if (data.status === 200) {
          this.selectedLocation = data;
          this.mapStyle = { display: "block" };
          this.MapCenter = latLng(data.result.latitude, data.result.longitude);
          this.MapZoom = 15;
          this.addMarker(data.result.latitude, data.result.longitude, this.pinGroup, this.MapData);
          setTimeout(() => {
            this.mapRender = !this.mapRender;
          }, 100);
          this.locationForm.controls["lat"].patchValue(parseInt(data.result.latitude.toString()));
          this.locationForm.controls["lng"].patchValue(parseInt(data.result.longitude.toString()));
          this.location = this.locationForm.value;
        } else {
          this.notificationService.warning("No address found for this postcode");
        }
      });
    } else {
      this.notificationService.warning("No Postcode entered");
    }
  }

  updateLocation() {
    this.location = this.locationForm.value;
    this.updated.emit(this.location);
  }

  addMarker(lat: any, lng: any, layer: any, map: any) {
    const newlayer = new L.LayerGroup();
    if (layer) {
      map.layers.splice(layer, 1);
    } else {
      layer = new L.LayerGroup();
    }
    const color = { color: "red" };
    this.pinGroup = L.marker(
      {
        lat: lat,
        lng: lng,
      },
      {
        icon: new L.Icon({
          iconUrl: "assets/images/marker-icon-2x-" + color.color + ".png",
          //shadowUrl: "assets/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }
    ).addTo(newlayer);
    map.layers.push(newlayer);
  }

  clearLocation() {
    this.location = null;
    this.formDirective.resetForm();
    this.MapData = {
      options: {
        layers: [
          tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            minZoom: 8,
            attribution: "...",
          }),
        ],
        zoom: 8,
        center: latLng(53.839268, -2.542037),
      },
      layers: [],
    };
    this.updated.emit(undefined);
  }
}
