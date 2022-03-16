import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {ILNullPhoto} from '../../assets';
import {colors, fonts, newColors} from '../../utils';

const Profile = ({name, desc, isRemove, photo, onPress, disable}) => {
  let photoData = photo ? photo : ILNullPhoto;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.borderProfile}
        onPress={onPress}
        disabled={disable}>
        <Image source={photoData} style={styles.avatar} />
        {!disable && (
          <View style={styles.iconWrapper(isRemove)}>
            <Icon
              type="material-community"
              name={isRemove ? 'close' : 'plus'}
              color={newColors.pureWhite}
            />
          </View>
        )}
      </TouchableOpacity>

      {name && (
        <View>
          <Text style={styles.name}>{name}</Text>
          {desc && <Text style={styles.profession}>{desc}</Text>}
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderProfile: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  profession: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  removePhoto: {
    position: 'absolute',
    right: 3,
    bottom: 3,
  },
  iconWrapper: (isRemove) => ({
    backgroundColor: isRemove ? newColors.tomatoRed : newColors.brightTurquiose,
    position: 'absolute',
    right: 3,
    bottom: 3,
    padding: 3,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: newColors.pureWhite,
  }),
});
