import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Profile, ProfileItem} from '../components';
import {colors, getStorageItem, mStyles} from '../utils';

const DoctorProfile = ({navigation, route}) => {
  let doctorData = route.params.data;
  const [hospital, setHospital] = useState(null);
  const [arrayData, setArrayData] = useState(null);

  let fullName = doctorData.full_name;
  let profession = doctorData.specialist;
  let photo = doctorData.profile_picture;
  let hospitalId = doctorData.hospital_id;
  let experience = doctorData.work_experience;

  useEffect(() => {
    getStorageItem('listHospital')
      .then((res) => {
        setHospital(res);
        let hospitalIndex = 0;
        for (let i = 0; i < res.length; i++) {
          if (res[i].hospital_id === hospitalId) {
            hospitalIndex = i;
            break;
          }
        }

        let hospitalName = res[hospitalIndex].hospital_name;
        let strNo = doctorData.str_no;
        let workExperience = moment().year() - experience;

        setArrayData([
          {label: 'Work At', value: hospitalName},
          {label: 'Str No.', value: strNo},
          {label: 'Work Experience', value: `${workExperience} years`},
        ]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={styles.page}>
      <Header title="Doctor Profile" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mStyles.listContainer}>
        <View style={styles.content}>
          <Profile
            name={fullName}
            desc={profession}
            photo={photo && {uri: photo}}
            disable
          />
          <Gap height={10} />
          {arrayData &&
            arrayData.map((item, index) => {
              return (
                <ProfileItem
                  label={item.label}
                  value={item.value}
                  key={index}
                />
              );
            })}
        </View>
        <View style={styles.action}>
          <Button
            title="Schedule Consultation"
            type="primary"
            onPress={() =>
              navigation.navigate('OrderDoctor', {
                data: doctorData,
                type: 'Consultation',
              })
            }
          />
          <Gap height={10} />
          <Button
            title="Make an Appointment"
            onPress={() =>
              navigation.navigate('OrderDoctor', {
                data: doctorData,
                type: 'Appointment',
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  action: {
    padding: 40,
    paddingTop: 23,
  },
});
