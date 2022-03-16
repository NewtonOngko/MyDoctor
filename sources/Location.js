import * as geolib from 'geolib';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Location = () => {
  const [pinPosition, setPinPosition] = useState(null);

  const targetPosition = {
    latitude: 3.544142,
    longitude: 98.6867559,
  };

  useEffect(() => {
    getPermission();
    findMyCord();
  }, []);

  const getPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  };

  const findMyCord = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setPinPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        accuracy: {android: 'high'},
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  };

  const getDistanceTarget = () => {
    if (pinPosition) {
      return geolib.getDistance(pinPosition, targetPosition, 0.1);
    }
    return 0;
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 50}} onPress={() => findMyCord()}>
        Get Distance{'\n'}
        {JSON.stringify(pinPosition)}
      </Text>
      {pinPosition && <Text>{getDistanceTarget()} m</Text>}
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({});
