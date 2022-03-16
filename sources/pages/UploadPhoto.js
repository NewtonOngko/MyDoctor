import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IconAddPhoto, IconRemovePhoto, ILNullPhoto} from '../assets';
import {Button, Gap, Header, Link} from '../components';
import FBase from '../config/FBase';
import {colors, fonts, setStorageItem} from '../utils';

const UploadPhoto = ({navigation, route}) => {
  const {fullName, profession, uid} = route.params;
  const [hasPhoto, setHasPhoto] = useState(false);
  const [userProfile, setUserProfile] = useState(ILNullPhoto);
  const [photoDB, setPhotoDB] = useState('');

  useEffect(() => {}, [userProfile]);
  const getImageLibrary = () => {
    // ImagePicker.launchImageLibrary(
    //   {quality: 0.7, maxHeight: 100, maxWidth: 100},
    //   (res) => {
    //     if (res.didCancel || res.error) {
    //       !hasPhoto && SnackBar('Failed to set your Profile Photo', 'danger');
    //     } else {
    //       setPhotoDB(`data:${res.type};base64, ${res.data}`);
    //       let photoSource = {uri: res.uri};
    //       setUserProfile(photoSource);
    //       setHasPhoto(true);
    //     }
    //   },
    // );
  };

  const updateImageOnDB = () => {
    FBase.database().ref(`users/${uid}/`).update({photo: photoDB});
    let data = route.params;
    data.photo = photoDB;
    setStorageItem('userData', data);
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.page}>
      <Header title="Upload Photo" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.profile}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={getImageLibrary}>
            <Image source={userProfile} style={styles.avatar} />
            {hasPhoto ? (
              <IconRemovePhoto style={styles.addphoto} />
            ) : (
              <IconAddPhoto style={styles.addphoto} />
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.job}>{profession}</Text>
        </View>
        <View>
          <Button
            title="Upload and Continue"
            type="primary"
            disable={!hasPhoto}
            onPress={updateImageOnDB}
          />
          <Gap height={30} />
          <Link
            link="Skip for this"
            align="center"
            size={16}
            onPress={() => navigation.replace('MainApp')}
          />
        </View>
      </View>
    </View>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  profile: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 150 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addphoto: {
    position: 'absolute',
    bottom: 6,
    right: 4,
  },
  name: {
    fontSize: 24,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    textAlign: 'center',
  },
  job: {
    color: colors.text.secondary,
    fontSize: 18,
    fontFamily: fonts.primary.normal,
    textAlign: 'center',
  },
});
