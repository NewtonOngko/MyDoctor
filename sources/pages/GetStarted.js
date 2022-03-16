import React, {useEffect} from 'react';
import {
  ImageBackground,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ILGetStarted, ILLogo} from '../assets';
import {Button, Gap} from '../components';
import {colors, fonts} from '../utils';

const GetStarted = ({navigation}) => {
  useEffect(() => {
    handleAndroidPermissions();
  }, []);

  const handleAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <ImageBackground source={ILGetStarted} style={styles.wrapper}>
      <View>
        <ILLogo />
        <Text style={styles.title}>
          Konsultasi dengan dokter jadi lebih mudah & fleksibel
        </Text>
      </View>
      <View>
        <Button
          title="Get Started"
          type="primary"
          onPress={() => navigation.navigate('Register')}
        />
        <Gap height={15} />
        <Button title="Sign In" onPress={() => navigation.navigate('Login')} />
      </View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  wrapper: {
    padding: 40,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 28,
    // fontWeight: '600',
    color: colors.white,
    marginTop: 90,
    textAlign: 'left',
    fontFamily: fonts.primary[600],
  },
});
