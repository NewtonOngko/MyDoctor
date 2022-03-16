import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Input, Loading} from '../components';
import {changePassword} from '../config';
import {getStorageItem, mStyles, SnackBar} from '../utils';

const ChangePassword = ({navigation}) => {
  const [uid, setUid] = useState(null);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStorageItem('user_data')
      .then((res) => {
        setUid(res.user_id);
      })
      .catch((err) => {
        console.log(err.data);
        navigation.goBack();
      });
  }, []);

  const onProcess = () => {
    setIsLoading(true);
    if (rePassword !== password) {
      setIsLoading(false);
      return SnackBar('Please recheck your password input!');
    }
    changePassword(uid, password)
      .then((res) => {
        SnackBar(res.message, 'sucess');
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err.data);
        setIsLoading(false);
      });
  };

  if (!uid) {
    return <Loading />;
  }

  return (
    <>
      <Header title="Change Password" onPress={() => navigation.goBack()} />
      <ScrollView
        style={mStyles.container}
        contentContainerStyle={styles.scrollContainer}>
        <View style={mStyles.container}>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Gap height={20} />
          <Input
            label="Re-type Password"
            value={rePassword}
            onChangeText={setRePassword}
            secureTextEntry={true}
          />
          <Gap height={20} />
        </View>
        <Button
          title="Change My Password"
          onPress={onProcess}
          type="primary"
          disabled={!password || !rePassword}
          isLoading={isLoading}
        />
      </ScrollView>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
