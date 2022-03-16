import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../utils';
import fontStyles from '../../utils/fonts';

const Link = ({link, size, align, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link(size, align)}>{link}</Text>
    </TouchableOpacity>
  );
};

export default Link;

const styles = StyleSheet.create({
  link: (size, align) => ({
    fontSize: size,
    color: colors.link,
    ...fontStyles.nunitoRegular,
    textDecorationLine: 'underline',
    textAlign: align,
  }),
});
