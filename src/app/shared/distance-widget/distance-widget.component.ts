import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models';
import { Company } from 'src/models/company.model';
@Component({
  selector: 'app-distance-widget',
  templateUrl: './distance-widget.component.html',
  styleUrls: ['./distance-widget.component.scss']
})
export class DistanceWidgetComponent implements OnInit, OnDestroy, AfterViewInit {
  //https://www.youtube.com/watch?v=BkGtNBrOhKU
  // Icons https://stackoverflow.com/questions/24936037/change-individual-markers-in-google-maps-directions

  @Input() originLat;
  @Input() user: User;
  @Input() mapId;
  @Input() originLng;
  @Input() destinationLat;
  @Input() destinationLng;
  @Input() company: Company;
  @Output() travelTimeEvent: EventEmitter<number> = new EventEmitter<number>();

  @Input() from;
  @Input() to;
  @Input() showForm;
  mapOptions;
  map: google.maps.Map;
  distance;
  time;
  currentPoint = { lat: -26.009617195941, lng: 28.014632233336 }
  directionsService: google.maps.DirectionsService;
  directionsDisplay: google.maps.DirectionsRenderer;
  error: any;
  options = {
    // types: ['(cities)'],
    types: [],
    componentRestrictions: { country: 'ZA' }
  }
  timeValue: number;
  marker: google.maps.Marker;
  marker2: google.maps.Marker;
  marker3: google.maps.Marker;
  timeInterval: any;
  subscription: any;
  map2: google.maps.Map<HTMLElement>;
  @Output() userEvent: EventEmitter<User> = new EventEmitter<User>();


  constructor() { }
  ngAfterViewInit(): void {
    this.mapOptions = {
      center: this.currentPoint,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      keyboardShortcuts: false,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions)
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#000000'
      }
    })
    this.directionsDisplay.setMap(this.map);

    if (this.showForm) {
      this.setAuto();
    }
    if (this.user)
    this.getCurrentLocation();


    if ((this.to && this.from) || (this.destinationLat && this.originLat)) {
      this.calculateRoute(this.from, this.to);
      this.timeInterval = interval(7000);
      this.subscription = this.timeInterval.subscribe(() => {
        this.calculateRoute(this.from, this.to);
        if (this.user)
          this.getCurrentLocation();
      })
    }
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  find() { }
  calculateRoute(from: string = '', to: string = '') {
    // const f: any = document.getElementById("from");
    // const t: any = document.getElementById("to");

    let request;

    if (this.originLat && this.destinationLat) {
      request = {
        origin: {
          lat: Number(this.originLat),
          lng: Number(this.originLng)
        },
        destination: {
          lat: Number(this.destinationLat),
          lng: Number(this.destinationLng)
        },
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }
    } else {
      request = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }
    }
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
    if (this.marker2) {
      this.marker2.setMap(null);
      this.marker2 = null;
    }
    if (this.marker3) {
      this.marker3.setMap(null);
      this.marker3 = null;
    }

    var icon = {
      url: 'assets/images/muuve-rider.gif', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    var homee = {
      url: 'assets/images/homee.gif', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    var restaurantanimationdribbble = {
      url: 'assets/images/restaurantanimationdribbble.gif', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let makerOptions: google.maps.ReadonlyMarkerOptions = {
      position: new google.maps.LatLng(Number(this.originLat), Number(this.originLng)),
      map: this.map,
      icon: icon,
      // animation: google.maps.Animation.DROP
    };
    this.marker = new google.maps.Marker(makerOptions);

    let makerOptions2 = {
      position: new google.maps.LatLng(Number(this.destinationLat), Number(this.destinationLng)),
      map: this.map,
      icon: homee,
    };
    this.marker2 = new google.maps.Marker(makerOptions2);
    if (this.company) {

      let makerOptions3 = {
        position: new google.maps.LatLng(Number(this.company.Latitude), Number(this.company.Longitude)),
        map: this.map,
        icon: restaurantanimationdribbble,
      };
      this.marker3 = new google.maps.Marker(makerOptions3);
    }
    this.directionsService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.distance = result.routes[0].legs[0].distance.value;
        this.distance = (this.distance * 0.001).toFixed(2);


        this.time = result.routes[0].legs[0].duration.text;
        this.timeValue = result.routes[0].legs[0].duration.value;
        this.timeValue = Math.ceil(this.timeValue / 60);
        this.travelTimeEvent.emit(this.timeValue);
        this.directionsDisplay.setDirections(result);

        if (this.timeValue) {
          this.travelTimeEvent.emit(this.timeValue);
        }
        // const output = document.querySelector("#output");
        // output.innerHTML = 

        // var startImage = new google.maps.MarkerImage('http://host/images/marker0.png',
      }
      else {
        this.directionsDisplay.setDirections(null);
        this.error = "Error";
      }
    });
  }

  setAuto() {
    const input1: any = document.getElementById("from");
    const input2: any = document.getElementById("to");

    const autoComplete1 = new google.maps.places.Autocomplete(input1, this.options);
    const autoComplete2 = new google.maps.places.Autocomplete(input2, this.options);
  }

  getCurrentLocation() {
    const _this = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        if (pos.lat != Number(_this.user.Latitude) || pos.lng !== Number(_this.user.Longitude)) {
          _this.user.Latitude = pos.lat;
          _this.user.Longitude = pos.lng;
          _this.codeAddress();
        }
      });
    }
  }
  codeAddress() {
    const _this = this;
    const location = new google.maps.LatLng(this.user.Latitude, this.user.Longitude)
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        _this.user.AddressLineHome = results[0].formatted_address;
        _this.user.AddressUrlWork = results[0].place_id;
        this.userEvent.emit(this.user);
      } else {
        // alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
