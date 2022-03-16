import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '../../../utils';

const LoadingProgress = () => {
  return (
    <View style={styles.loadingWrapper}>
      <View style={styles.loadingContent}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    </View>
  );
};

export default LoadingProgress;

const styles = StyleSheet.create({
  loadingContent: {
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(33,33, 33, 0.5)',
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
});
