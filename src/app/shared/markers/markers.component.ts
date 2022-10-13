import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { User } from 'src/models';
import { LocationModel } from 'src/models/UxModel.model';
import { UserService } from 'src/services';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss']
})
export class MarkersComponent implements OnInit, OnDestroy, AfterViewInit {
  // @Input() 
  mapId: string = 'googleMap';
  @Input() lat;
  @Input() lng;
  @Input() user: User;
  @Output() cordsEvent: EventEmitter<LocationModel> = new EventEmitter<LocationModel>();;
  currentPoint;
  map: google.maps.Map;
  mapOptions;
  marker: google.maps.Marker;
  marker2: google.maps.Marker;
  marker3: google.maps.Marker;
  lol;
  timeInterval: any;
  subscription: any;
  constructor(private userService: UserService) { }
  ngAfterViewInit(): void {
    const _this = this;
    setTimeout(() => {
      this.loadMap();
      this.loadMakers();
      google.maps.event.addListener(this.marker, 'dragend', function (event) {
        _this.lat = event.latLng.lat()
        _this.lng = event.latLng.lng()
        _this.codeAddress()
      })
    }, 1);
   
  }

  ngOnInit(): void {


  }

  loadMap() {
    // debugger
    if (this.lat) {
      this.currentPoint = { lat: Number(this.lat), lng: Number(this.lng) }
      this.mapOptions = {
        center: this.currentPoint,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        keyboardShortcuts: false,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }


  log(e) {
    console.log(e);
  }
  loadMakers() {
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }

    var icon = {
      url: 'assets/images/muuve-rider.gif', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let makerOptions: google.maps.ReadonlyMarkerOptions = {
      position: new google.maps.LatLng(Number(this.lat), Number(this.lng)),
      map: this.map,
      draggable: true,
      icon: icon
    };
    this.marker = new google.maps.Marker(makerOptions);
  }

  codeAddress() {
    const location = new google.maps.LatLng(this.lat, this.lng)
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.log(results);
        this.cordsEvent.emit(
          {
            lat: this.lat,
            lng: this.lng,
            addressLine: results[0].formatted_address,
            url: results[0].place_id
          });

        this.loadMakers();
      } else {
        // alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
