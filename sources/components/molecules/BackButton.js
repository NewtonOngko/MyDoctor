import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {newColors} from '../../utils';

const BackButton = ({onPress, color = newColors.brightTurquiose}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
      <Icon type="material-community" name="arrow-left" color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    top: 20,
    left: 16,
    padding: 10,
    borderRadius: 50,
    backgroundColor: newColors.pureWhite,
  },
});
