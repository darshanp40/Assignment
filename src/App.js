import React, { Component } from 'react';
import { MapConfig } from './Configurations/MapConfig';
import './App.css';
import SearchBar from './Components/SearchBar'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationData: [],
      markerData: [],
      mapConfig: MapConfig,
      prevInfoWindow: ''
    }
    this.initMap = this.initMap.bind(this);
  }
  fetchLocationData() {
    fetch('data.json').then((res) => res.json()).then((result) => {
      console.log(result);
      this.setState({
        locationData: result
      })
      window.loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBmXCfdkOXHw8dguZinjjDg55YPvGDrskI&callback=initMap")
    }).catch((error) => {
      console.log(error);
    })
  }
  componentDidMount() {
    this.fetchLocationData();
    window.initMap = this.initMap;
  }
  initMap() {
    window.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: parseFloat(this.state.locationData[0].location.lat),
        lng: parseFloat(this.state.locationData[0].location.lng)
      },
      zoom: 6
    });
    let markerData = [];
    let that = this;
    this.state.locationData.forEach(function (result) {
      let position = result.location;
      position.lat = parseFloat(position.lat);
      position.lng = parseFloat(position.lng);
      let marker = new window.google.maps.Marker({
        position: position,
        map: window.map
      });
      let contentString = '<div class="image-card">' +
        '<div class="card-header">' +
        '<div class="card-header-text">' + result.place + ', ' + result.state + '</div>' +
        '</div>' +
        '<div class="card-footer">' +
        '<div class="card-footer-text">' +
        'Coordinates: ' + result.location.lat + result.location.lng +
        '</div>' +
        '</div>' +
        '</div>';
      let infowindow = new window.google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', function () {
        if (that.state.prevInfoWindow) {
          that.state.prevInfoWindow.close();
        }
        infowindow.open(window.map, marker);
        that.setState({
          prevInfoWindow: infowindow
        });
      });
      markerData.push(marker);
    })
    that.setState({
      markerData: markerData
    })
    window.google.maps.event.addListener(window.map, 'click', function () {
      if (that.state.prevInfoWindow) {
        that.state.prevInfoWindow.close();
      }
    });
    window.google.maps.event.addDomListener(window, "resize", function () {
      var center = window.map.getCenter();
      window.google.maps.event.trigger(window.map, "resize");
      window.map.setCenter(center);
    });
    document.addEventListener('click', function() {
      if (that.state.prevInfoWindow) {
        that.state.prevInfoWindow.close();
      }
    }, true);

  }
  render() {
    return (
      <div className="App">
        <SearchBar searchData={this.state.locationData} markerData={this.state.markerData} />
        <div id="map"></div>
      </div>
    );
  }
}
export default App;
