import moment from 'moment';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Button, Gap, Header, Input} from '../components';
import {getUser, registerUser} from '../config';
import {colors, mStyles, setStorageItem, SnackBar, toast} from '../utils';

const Register = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isShowingPicker, setIsShowingPicker] = useState(false);

  const onContinue = () => {
    setIsButtonLoading(true);
    if (password !== confirmPassword) {
      setIsButtonLoading(false);
      return toast("Please check your password's input");
    }
    handleRegister();
  };

  const handleRegister = () => {
    let formData = {
      full_name: fullName,
      email: email.toLowerCase().trim(),
      password: password,
      address: ' ',
      gender: gender ? gender : ' ',
      phone_number: phoneNumber.trim(),
      birthdate: birthDate,
      birthplace: ' ',
      profile_picture: '',
    };

    registerUser(formData)
      .then((res) => {
        console.log('res', res);
        if (res.error) {
          console.log(res.message);
          setIsButtonLoading(false);
          return;
        }
        getUser(res.data)
          .then((response) => {
            console.log('data user', response);
            setStorageItem('user_data', response).then(() => {
              SnackBar('Success Register!', 'success');
              navigation.replace('MainApp');
              setIsButtonLoading(false);
            });
          })
          .catch((err) => {
            console.log(err.data);
            setIsButtonLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setIsButtonLoading(false);
      });
  };

  const arrayFormData = [
    {
      label: 'Full Name',
      value: fullName,
      onChange: setFullName,
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
      label: 'Date of Birth',
      value: birthDate,
      onChange: setBirthDate,
    },
    {
      label: 'Gender',
      value: gender,
      onChange: setGender,
    },

    {
      label: 'Password',
      value: password,
      onChange: setPassword,
    },
    {
      label: 'Confirm Password',
      value: confirmPassword,
      onChange: setConfirmPassword,
    },
  ];

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

  return (
    <View style={styles.wrapper}>
      <Header title="Register" onPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
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
            let isPasssword =
              item.label === 'Password' || item.label === 'Confirm Password';
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
                  secureTextEntry={isPasssword}
                />
                <Gap height={20} key={`gap-${index}`} />
              </>
            );
          })}
        </View>
        <Gap height={20} />

        <Button
          type="primary"
          title="Register"
          onPress={onContinue}
          isLoading={isButtonLoading}
        />
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  content: {
    ...mStyles.container,
  },
  scrollContainer: {
    ...mStyles.listContainer,
    padding: 40,
    paddingTop: 10,
  },
  wrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
