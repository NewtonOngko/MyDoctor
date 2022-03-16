import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Gap, Profile} from '../components';
import {
  getStorageItem,
  mStyles,
  newColors,
  removeStorageItem,
  SnackBar,
} from '../utils';
import fontStyles from '../utils/fonts';

const UserProfile = ({navigation}) => {
  const [photo, setPhoto] = useState('');
  const [fullName, setFullName] = useState('');
  let isFocus = useIsFocused();

  const handleGetUserData = () => {
    getStorageItem('user_data')
      .then((res) => {
        setPhoto(res.profile_picture);
        setFullName(res.full_name);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isFocus) {
      handleGetUserData();
    }
  }, [isFocus]);

  const menus = [
    {
      name: 'Edit Profile',
      iconName: 'account-cog-outline',
      navigation: 'UpdateProfile',
    },
    {
      name: 'Change Password',
      iconName: 'lock',
      navigation: 'ChangePassword',
    },
    {
      name: 'Sign Out',
      iconName: 'exit-to-app',
      navigation: '',
    },
  ];

  const handleListItem = (isSignOut, menu) => {
    if (isSignOut) {
      navigation.reset({
        index: 0,
        routes: [{name: 'GetStarted'}],
      });
      SnackBar('Sign Out Success', 'success');
      removeStorageItem();
    } else {
      navigation.navigate(menu);
    }
  };

  return (
    <View style={mStyles.page}>
      <View style={mStyles.content}>
        <ScrollView
          style={mStyles.container}
          contentContainerStyle={styles.scollContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <Gap height={10} />
            {fullName.length > 0 && (
              <Profile disable name={fullName} photo={photo && {uri: photo}} />
            )}

            <Gap height={14} />
            {menus.map((menu, index) => {
              let isSignOut = menu.name === 'Sign Out';
              let itemColor = isSignOut
                ? newColors.tomatoRed
                : newColors.blueBayoux;

              return (
                <TouchableOpacity
                  onPress={() => handleListItem(isSignOut, menu.navigation)}>
                  <ListItem key={index} bottomDivider>
                    <Icon
                      type="material-community"
                      name={menu.iconName}
                      color={itemColor}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.titleStyle(itemColor)}>
                        {menu.name}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron color={itemColor} size={24} />
                  </ListItem>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  scollContainer: {
    ...mStyles.listContainer,
    paddingVertical: 20,
  },
  titleStyle: (color) => ({
    ...fontStyles.heading,
    color: color,
  }),
});
