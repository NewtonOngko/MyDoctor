import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ILLogo} from '../assets';
import {Button, Gap, Input, Link} from '../components';
import {getUser, loginUser} from '../config';
import {colors, fonts, mStyles, setStorageItem, SnackBar} from '../utils';

const Login = ({navigation}) => {
  const [email, setIsEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    console.log(email, password);
    loginUser(email.toLowerCase(), password)
      .then((res) => {
        console.log('login res', res);
        getUserData(res.id);
      })
      .catch((err) => {
        console.log('login err', err.data);
        setIsLoading(false);
      });
  };

  const getUserData = (userId) => {
    getUser(userId)
      .then((response) => {
        console.log('data user', response);
        setStorageItem('user_data', response).then(() => {
          SnackBar('Success Login!', 'success');
          navigation.replace('MainApp');
          setIsLoading(false);
        });
      })
      .catch((err) => {
        console.log(err.data);
        setIsLoading(false);
      });
  };

  return (
    <ScrollView
      style={mStyles.container}
      contentContainerStyle={mStyles.listContainer}>
      <View style={styles.wrapper}>
        <ILLogo />
        <Text style={styles.text}>Masuk dan Mulai Konsultasi.</Text>
        <Input
          label="Email Address"
          value={email}
          onChangeText={setIsEmail}
          keyboardType="email-address"
        />
        <Gap height={24} />
        <Input
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Gap height={10} />
        <Link link="Forget Password?" size={12} />
        <Gap height={40} />
        <Button
          type="primary"
          title="Sign In"
          onPress={handleLogin}
          isLoading={isLoading}
        />
        <Gap height={30} />
        <Link
          link="Create New Account"
          size={16}
          align="center"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    padding: 40,
    backgroundColor: colors.white,
    flex: 1,
  },
  text: {
    fontSize: 20,
    width: 155,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginVertical: 40,
  },
});
