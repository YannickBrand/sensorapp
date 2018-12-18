import React, { Component } from 'react';
import { MapView,PROVIDER_GOOGLE} from 'expo';
import {StyleSheet} from "react-native";

export default class Map extends Component {
    state = {
      latitude: 52.516773,
      longitude: 6.083022,
      markers: [{
        title:  "pz001",
        latitude: 52.537700000118463,
        longitude: 6.0398600003354126
      },
      {
        title:  "pz002",
        latitude: 52.525100000167505,
        longitude: 6.0618999996429537
      },
      {
        title:  "pz005",
        latitude: 52.541200000255209,
        longitude: 6.0624000001334695
      },
      {
        title:  "pz006",
        latitude: 52.538199999893408,
        longitude: 6.0550999999788733
      }
    ]
    }
    componentDidMount() {
      this.watchPosition();
    }
  
    async watchPosition() {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          const obj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            title: "Your Location"
          }
          let arryObj = this.state.markers;
          arryObj.push(obj);
  
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            markers: arryObj
          })
        },
        (error) => alert(error.message + " Please you need to turn on location"),
        { enableHighAccuracy: false, timeout: 50000 }
      );
    }

    render() {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
        >
          {this.state.markers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
            />
          ))}
        </MapView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
