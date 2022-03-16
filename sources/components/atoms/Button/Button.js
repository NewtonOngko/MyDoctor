import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts} from '../../../utils';
import BtnIconSend from './BtnIconSend';
import IconOnly from './IconOnly';

const Button = ({
  type,
  title,
  onPress,
  icon,
  disabled,
  isLoading,
  buttonCustomStyle,
}) => {
  if (isLoading) {
    disabled = true;
  }
  if (type === 'btn-icon-send') {
    return <BtnIconSend disable={disabled} onPress={onPress} />;
  }
  if (type === 'icon-only') {
    return <IconOnly icon={icon} onPress={onPress} />;
  }
  return (
    <TouchableOpacity
      style={[styles.wrapper(type, disabled), buttonCustomStyle]}
      onPress={onPress}
      disabled={disabled}>
      {isLoading ? (
        <ActivityIndicator color={colors.white} style={{marginVertical: 0.5}} />
      ) : (
        <Text style={styles.text(type, disabled)}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  wrapper: (type, disable) => ({
    backgroundColor: disable
      ? colors.button.disable.background
      : type === 'primary'
      ? colors.button.primary.background
      : colors.button.secondary.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  }),
  text: (type, disable) => ({
    fontSize: 18,
    // fontWeight: '600',
    textAlign: 'center',
    color: disable
      ? colors.button.disable.text
      : type === 'primary'
      ? colors.button.primary.text
      : colors.button.secondary.text,
    fontFamily: fonts.primary[600],
  }),
});
