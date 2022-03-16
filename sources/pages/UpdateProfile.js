import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  Button,
  ContentPicker,
  Gap,
  Header,
  Input,
  Loading,
  Profile,
} from '../components';
import {getUser, updateUser} from '../config';
import {
  colors,
  getStorageItem,
  mStyles,
  setStorageItem,
  SnackBar,
  uploadToStorage,
} from '../utils';

const UpdateProfile = ({navigation}) => {
  const [isGettingData, setIsGettingData] = useState(false);
  const [isShowingPicker, setIsShowingPicker] = useState(false);
  const [isShowingImagePicker, setIsShowingImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [photo, setPhoto] = useState('');

  const [uid, setUid] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const handleGetUserData = () => {
    setIsGettingData(true);
    getStorageItem('user_data')
      .then((res) => {
        setUid(res.user_id);
        setPhoto(res.profile_picture);
        setFullName(res.full_name);
        setEmail(res.email);

        setAddress(res.address !== ' ' ? res.address : '');
        setGender(res.gender !== ' ' ? res.gender : '');
        setPhoneNumber(res.phone_number);
        setBirthDate(res.birthdate);
        setBirthPlace(res.birthplace !== ' ' ? res.birthplace : '');
        setIsGettingData(false);
      })
      .catch((err) => {
        SnackBar(err.data.message, 'danger');
        setIsGettingData(false);
      });
  };

  const uploadToDB = () => {
    setIsLoading(true);

    if (selectedImage) {
      let storagePath = `/images/users/${uid}/${selectedImage.fileName}`;
      uploadToStorage(selectedImage.uri, storagePath).then((res) => {
        console.log('link ', res);
        updateData(res);
      });
    } else {
      updateData('');
    }
  };

  const updateData = (photoLink) => {
    let formData = {
      full_name: fullName,
      email: email.trim(),
      address: address ? address : ' ',
      gender: gender ? gender : ' ',
      phone_number: phoneNumber.trim(),
      birthdate: birthDate,
      birthplace: birthPlace ? birthPlace : ' ',
      profile_picture: photoLink ? photoLink : photo,
    };

    updateUser(uid, formData)
      .then(() => {
        getUser(uid)
          .then((response) => {
            console.log('data user', response);
            setStorageItem('user_data', response).then(() => {
              SnackBar('Success Update data!', 'success');
              navigation.goBack();
              setIsLoading(false);
            });
          })
          .catch((err) => {
            console.log(err.data);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err.data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleGetUserData();
  }, []);

  const onUploadContent = (response) => {
    if (response) {
      setSelectedImage(response);
      setPhoto(response.uri);
    }
  };
  const onDateConfirm = (date) => {
    let year = moment(new Date(date)).year();
    let month = moment(new Date(date)).month() + 1;
    let dateValue = moment(new Date(date)).date();

    if (month < 10) {
      month = '0' + month;
    }
    if (dateValue < 10) {
      dateValue = '0' + dateValue;
    }

    let combineDate = `${year}-${month}-${dateValue}`;

    setBirthDate(combineDate);
    setIsShowingPicker(false);
  };
  const arrayFormData = [
    {
      label: 'Full Name',
      value: fullName,
      onChange: setFullName,
    },
    {
      label: 'Address',
      value: address,
      onChange: setAddress,
    },
    {
      label: 'Gender',
      value: gender,
      onChange: setGender,
    },
    {
      label: 'Email',
      value: email,
      onChange: setEmail,
    },
    {
      label: 'Phone Number',
      value: phoneNumber,
      onChange: setPhoneNumber,
    },
    {
      label: 'Place of Birth',
      value: birthPlace,
      onChange: setBirthPlace,
    },
    {
      label: 'Date of Birth',
      value: birthDate,
      onChange: setBirthDate,
    },
  ];

  if (isGettingData) {
    return <Loading />;
  }
  return (
    <View style={styles.page}>
      <ContentPicker
        closeContentPicker={() => setIsShowingImagePicker(false)}
        isVisible={isShowingImagePicker}
        onSuccess={onUploadContent}
      />
      <Header onPress={() => navigation.goBack()} title="Edit Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={mStyles.container}
        contentContainerStyle={mStyles.listContainer}>
        <View style={styles.content}>
          <Profile
            isRemove={photo ? true : false}
            onPress={() => {
              if (photo) {
                return setPhoto('');
              }
              setIsShowingImagePicker(true);
            }}
            photo={photo && {uri: photo}}
          />
          <Gap height={26} />
          <DateTimePicker
            is24Hour
            mode="date"
            isVisible={isShowingPicker}
            value={birthDate}
            onConfirm={onDateConfirm}
            onCancel={() => setIsShowingPicker(false)}
          />
          <View style={mStyles.container}>
            {arrayFormData.map((item, index) => {
              if (item.label === 'Date of Birth') {
                return (
                  <>
                    <TouchableOpacity onPress={() => setIsShowingPicker(true)}>
                      <Input
                        partialDisable
                        key={`input-${index}`}
                        label={item.label}
                        value={item.value}
                      />
                    </TouchableOpacity>
                    <Gap height={20} key={`gap-${index}`} />
                  </>
                );
              }

              let isEmail = item.label === 'Email';
              let isPhoneNumber = item.label === 'Phone Number';
              let keyboardType = isPhoneNumber
                ? 'number-pad'
                : isEmail
                ? 'email-address'
                : null;
              return (
                <>
                  <Input
                    key={`input-${index}`}
                    label={item.label}
                    value={item.value}
                    keyboardType={keyboardType}
                    onChangeText={item.onChange}
                    disable={isEmail}
                  />
                  <Gap height={20} key={`gap-${index}`} />
                </>
              );
            })}
          </View>
          <Gap height={20} />
          <Button
            title="Save Profile"
            type="primary"
            onPress={uploadToDB}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
