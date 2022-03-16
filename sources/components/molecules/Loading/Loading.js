import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '../../../utils';

const Loading = ({customStyles}) => {
  return (
    <View style={[styles.wrapper, customStyles]}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
