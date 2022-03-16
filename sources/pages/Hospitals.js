import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ILHospitalBG} from '../assets/illustration';
import {ListHospital} from '../components';
import FBase from '../config/FBase';
import {colors, fonts} from '../utils';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  useEffect(() => {
    handleGetHospitals();
  }, []);

  const handleGetHospitals = () => {
    FBase.database()
      .ref('hospitals/')
      .once('value')
      .then((res) => {
        if (res.val()) {
          setHospitals(res.val());
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollContainer}>
      <ImageBackground source={ILHospitalBG} style={styles.background}>
        <Text style={styles.title}>Hospitals</Text>
        <Text style={styles.desc}>{hospitals.length} tersedia</Text>
      </ImageBackground>
      <View style={styles.content}>
        {hospitals.length > 0 &&
          hospitals.map((item, index) => {
            return (
              <ListHospital
                key={index}
                type={item.type}
                name={item.name}
                address={item.address}
                image={item.image}
              />
            );
          })}
      </View>
    </ScrollView>
  );
};

export default Hospitals;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  scrollContainer: {flexGrow: 1},
  content: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: -30,
    flex: 1,
    paddingTop: 14,
  },
  background: {
    height: 240,
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    marginTop: 6,
    fontFamily: fonts.primary[600],
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors.white,
    marginTop: 6,
    textAlign: 'center',
  },
});
