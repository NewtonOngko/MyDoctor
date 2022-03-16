import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IconStar, ILNullPhoto} from '../../assets';
import {colors, fonts} from '../../utils';

const TopRatedDoctor = ({onPress, name, desc, avatar, rate}) => {
  avatar = avatar ? avatar : ILNullPhoto;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.profile}>
        <Text styles={styles.name}>{name}</Text>
        <Text style={styles.category}>{desc}</Text>
      </View>
      <View style={styles.rate}>
        <Text style={styles.rateNumber}>{rate.toFixed(2)}</Text>
        <IconStar />
      </View>
    </TouchableOpacity>
  );
};

export default TopRatedDoctor;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 12,
  },
  rateNumber: {fontFamily: fonts.primary[600], marginRight: 5, fontSize: 16},
  rate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
  },
  category: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
