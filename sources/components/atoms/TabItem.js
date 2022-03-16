import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '../../utils';
import fontStyles from '../../utils/fonts';

const TabItem = ({title, active, onPress, onLongPress}) => {
  const IconTab = () => {
    let iconName =
      title === 'Dashboard'
        ? 'home'
        : title === 'Activity'
        ? 'ticket'
        : title === 'Transactions'
        ? 'credit-card-outline'
        : title === 'Medicine'
        ? 'pill'
        : 'account-circle';
    return (
      <Icon
        size={24}
        type="material-community"
        name={iconName}
        containerStyle={{margin: -2}}
        color={active ? colors.text.menuActive : colors.text.menuInactive}
      />
    );
  };
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <IconTab />
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  wrapper: {alignItems: 'center'},
  text: (active) => ({
    ...fontStyles.caption,
    color: active ? colors.text.menuActive : colors.text.menuInactive,
    marginTop: 3,
  }),
});
