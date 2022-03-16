import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {IconNext, ILNullPhoto} from '../../assets';
import {colors, fonts, newColors} from '../../utils';

const List = ({profile, name = 'null', desc, type, onPress, icon}) => {
  profile = profile ? profile : ILNullPhoto;
  let iconName =
    icon === 'edit-profile' ? 'account-circle-outline' : 'exit-to-app';
  let iconColor =
    icon === 'edit-profile' ? newColors.brightTurquiose : newColors.tomatoRed;
  const MyIcon = () => {
    if (true) {
      return (
        <Icon type="material-community" name={iconName} color={iconColor} />
      );
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon ? <MyIcon /> : <Image source={profile} style={styles.avatar} />}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
      {type === 'next' && <IconNext />}
    </TouchableOpacity>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
  },
  content: {flex: 1, marginLeft: 16},
  name: {
    fontSize: 16,
    fontFamily: fonts.primary.normal,
    color: colors.text.primary,
  },
  desc: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
});
