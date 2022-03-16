import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {HospitalBg} from '../assets/images';
import {BackButton, Gap, List, Loading} from '../components';
import {
  getStorageItem,
  mStyles,
  newColors,
  screenWidth,
  SnackBar,
} from '../utils';
import fontStyles from '../utils/fonts';

const HospitalDetail = ({navigation, route}) => {
  let hospitalData = route.params.data;
  let hospitalId = hospitalData.hospital_id;
  let hospitalName = hospitalData.hospital_name;
  let hospitalDesc = hospitalData.description;
  let hospitalPhone = hospitalData.phone_number;

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    getStorageItem('listDoctor')
      .then((res) => {
        let tempData = [];
        res.map((item) => {
          if (item.hospital_id === hospitalId) {
            tempData.push(item);
          }
        });
        setDoctor(tempData);
      })
      .catch((err) => console.log(err.data));
  }, []);

  const gotoLocation = () => {
    if (!hospitalData.latitude || !hospitalData.longitude) {
      return SnackBar('location not valid', 'danger');
    }

    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${hospitalData.latitude},${hospitalData.longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <>
      <ImageBackground source={HospitalBg} style={styles.imageBgStyle}>
        <BackButton onPress={() => navigation.goBack()} />
        <TouchableOpacity style={styles.locationWrapper} onPress={gotoLocation}>
          <Icon
            type="material-community"
            name="google-maps"
            color={newColors.brightTurquiose}
          />
        </TouchableOpacity>
        <View style={styles.hospitalDescWrapper}>
          <Text
            style={styles.hospitalName}
            numberOfLines={2}
            ellipsizeMode="tail">
            {hospitalName}
          </Text>
          <Text
            style={styles.hospitalDesc}
            numberOfLines={1}
            ellipsizeMode="tail">
            {hospitalDesc}
          </Text>
          <View style={styles.phoneWrapper}>
            <Icon type="material-community" name="phone" size={16} />
            <Gap width={5} />
            <Text style={fontStyles.heading}>{hospitalPhone}</Text>
          </View>
        </View>
      </ImageBackground>
      <ScrollView
        style={mStyles.container}
        contentContainerStyle={mStyles.listContainer}>
        <View style={{}}>
          {!doctor ? (
            <Loading />
          ) : (
            doctor.map((item, index) => {
              console.log(item);
              let profilePic = item.profile_picture;
              let fullName = item.full_name;
              let specialist = item.specialist ? item.specialist : '';
              return (
                <List
                  key={index}
                  type="next"
                  profile={{uri: profilePic}}
                  name={fullName}
                  desc={specialist}
                  onPress={() => {
                    navigation.navigate('DoctorProfile', {data: item});
                  }}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default HospitalDetail;

const styles = StyleSheet.create({
  imageBgStyle: {
    ...mStyles.centerVerticalInline,
    width: screenWidth,
    height: (screenWidth * 300) / 720,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  phoneWrapper: {
    ...mStyles.centerVerticalInline,
    alignSelf: 'flex-end',
  },
  hospitalName: {
    ...fontStyles.title4,
    ...fontStyles.nunitoBold,
    textAlign: 'right',
    width: '80%',
  },
  hospitalDescWrapper: {
    alignItems: 'flex-end',
    flex: 1,
    alignSelf: 'flex-end',
  },
  hospitalDesc: {...fontStyles.heading, textAlign: 'right', width: '80%'},
  locationWrapper: {
    width: 36,
    aspectRatio: 1,
    backgroundColor: newColors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: newColors.dustyGray,
  },
});
