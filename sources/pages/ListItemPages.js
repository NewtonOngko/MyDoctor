import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header, ListRecDoctor, Loading} from '../components';
import {getStorageItem, mStyles, newColors} from '../utils';
import fontStyles from '../utils/fonts';

const ListItemPages = ({route, navigation}) => {
  let type = route.params ? route.params.type : 'doctor';
  let data = route.params ? route.params.data : [];

  const [titlePage, setTitlePage] = useState('List Hospitals');
  const [listData, setListData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    if (type === 'doctor') {
      setTitlePage('Recommended Doctors');
      let dataLength = data.length;
      let tempData = data.slice(0, dataLength > 20 ? 20 : dataLength);
      setListData(tempData);
    } else if (type === 'news') {
      setTitlePage('News');
      setListData(data);
    }

    getStorageItem('listHospital')
      .then((res) => {
        setHospitalData(res);
        console.log('hospital done list item pages', res);
      })
      .catch((err) => {
        console.log(err.data);
      });
    getStorageItem('listDoctor')
      .then((res) => {
        setDoctorData(res);
      })
      .catch((err) => {
        console.log(err.data);
      });
  }, []);

  let isHospitalReady = hospitalData && type === 'hospital';
  let isDataReady = hospitalData && doctorData && listData && type === 'doctor';
  let isNewsReady = listData && type === 'news';

  return (
    <>
      <Header onPress={() => navigation.goBack()} title={titlePage} />
      <ScrollView
        style={mStyles.container}
        contentContainerStyle={styles.scrollContainer}>
        {!(hospitalData && doctorData) && <Loading />}
        {isHospitalReady &&
          hospitalData.map((item, index) => {
            let hospitalName = item.hospital_name;
            let desc = item.description;
            // console.log(item.distance);
            let newDistance = `${(item.distance / 1000).toFixed(2)} km`;
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HospitalDetail', {data: item})
                }
                style={styles.hospitalListWrapper}
                key={index}>
                <View style={mStyles.container}>
                  <Text style={fontStyles.heading}>{hospitalName}</Text>
                  <Text
                    style={fontStyles.caption}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {desc}
                  </Text>
                </View>
                <Text style={fontStyles.body1}>{newDistance}</Text>
              </TouchableOpacity>
            );
          })}

        {isDataReady &&
          listData.map((recommendData, index) => {
            let doctorId = recommendData.doctor_id;
            let doctorIndex = doctorData.findIndex(
              (item) => item.doctor_id === doctorId,
            );
            let hospitalId = doctorData[doctorIndex].hospital_id;
            let hospitalIndex = hospitalData.findIndex(
              (item) => item.hospital_id === hospitalId,
            );

            let hospitalName = hospitalData[hospitalIndex].hospital_name;
            let doctorName = doctorData[doctorIndex].full_name;
            let doctorPhoto = doctorData[doctorIndex].profile_picture;
            let doctorProfession = doctorData[doctorIndex].specialist;

            return (
              <ListRecDoctor
                key={index}
                name={`${doctorName}`}
                desc={doctorProfession}
                avatar={{uri: doctorPhoto}}
                hospital={hospitalName}
                onPress={() => {
                  navigation.navigate('DoctorProfile', {
                    data: doctorData[doctorIndex],
                  });
                }}
              />
            );
          })}
        {isNewsReady}
      </ScrollView>
    </>
  );
};

export default ListItemPages;

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hospitalListWrapper: {
    ...mStyles.centerVerticalInline,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: newColors.dustyGray,
    alignItems: 'flex-end',
  },
});
