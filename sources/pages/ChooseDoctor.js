import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header, List, Loading} from '../components';
import {colors, getStorageItem} from '../utils';

const ChooseDoctor = ({navigation, route}) => {
  const [doctors, setDoctors] = useState(null);
  let categoryData = route.params.data;

  useEffect(() => {
    handleCategoryDoctors();
  }, []);

  const handleCategoryDoctors = () => {
    getStorageItem('listDoctor').then((res) => {
      let tempData = [];
      res.map((item) => {
        if (item.specialist === categoryData) {
          tempData.push(item);
        }
      });
      setDoctors(tempData);
    });
  };
  return (
    <>
      <Header
        title={`${categoryData}`}
        type="dark"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.page}>
          {!doctors ? (
            <Loading customStyles={{height: 0}} />
          ) : doctors.length > 0 ? (
            <>
              {doctors.map((doctor, index) => {
                let profilePic = doctor.profile_picture;
                let fullName = doctor.full_name;
                let hospitalName = doctor.hospitalData
                  ? doctor.hospitalData.hospital_name
                  : '';

                return (
                  <List
                    key={index}
                    type="next"
                    profile={{uri: profilePic}}
                    name={fullName}
                    desc={hospitalName}
                    onPress={() => {
                      navigation.navigate('DoctorProfile', {data: doctor});
                    }}
                  />
                );
              })}
            </>
          ) : (
            <Text>No Available Doctor</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContainer: {flexGrow: 1},
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
