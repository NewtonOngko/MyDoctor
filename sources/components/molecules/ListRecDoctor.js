import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ILNullPhoto} from '../../assets';
import {mStyles, newColors} from '../../utils';
import fontStyles from '../../utils/fonts';

const ListRecDoctor = ({
  avatar = ILNullPhoto,
  onPress,
  name,
  desc,
  rate,
  hospital,
}) => {
  avatar = avatar.uri ? avatar : ILNullPhoto;
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image source={avatar} style={styles.avatar} />
      <View style={mStyles.container}>
        <Text style={styles.doctorName}>{name}</Text>
        <View style={mStyles.centerVerticalInline}>
          <Text style={[styles.desc]} ellipsizeMode="tail" numberOfLines={1}>
            {desc}
          </Text>
          {hospital && (
            <Text style={styles.desc} ellipsizeMode="tail" numberOfLines={1}>
              {' '}
              | {hospital}
            </Text>
          )}
        </View>
      </View>
      <Icon
        type="material-community"
        name="chevron-right-circle-outline"
        color={newColors.brightTurquiose}
      />
    </TouchableOpacity>
  );
};

export default ListRecDoctor;

const styles = StyleSheet.create({
  wrapper: {
    ...mStyles.centerVerticalInline,
    marginBottom: 10,
    // backgroundColor: newColors.blueBayoux,
    paddingVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 10,
  },
  doctorName: {
    ...fontStyles.heading,
    color: newColors.carbonBlack,
    marginBottom: 3,
  },
  desc: {
    ...fontStyles.body1,
    color: newColors.dustyGray,
    ...mStyles.container,
  },
});
