import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ILLogo} from '../assets';
import {getUser} from '../config/UserRepo';
import {colors, fonts, getStorageItem, setStorageItem} from '../utils';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      getStorageItem('user_data')
        .then((res) => {
          console.log('userData', res);
          if (res) {
            let userId = res.user_id;
            getUser(userId)
              .then((response) => {
                setStorageItem('user_data', response).then(() => {
                  console.log('userData', res);
                  navigation.replace('MainApp');
                });
              })
              .catch((err) => {
                console.log(err);
                navigation.replace('GetStarted');
              });
          } else {
            navigation.replace('GetStarted');
          }
        })
        .catch((err) => {
          console.log(err);
          navigation.replace('GetStarted');
        });
    }, 1000);
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <ILLogo />
      <Text style={styles.title}>My Doctor</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    // fontWeight: '600',
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
  },
});
