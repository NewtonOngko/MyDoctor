import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {colors, fonts, screenHeight} from '../../utils';

const BottomSheet = ({
  showModal,
  closeModal,
  children,
  title,
  maxHeight = 600,
  props,
}) => {
  return (
    <ReactNativeModal
      isVisible={showModal}
      swipeThreshold={50}
      swipeDirection={['down']}
      propagateSwipe
      useNativeDriver
      onBackButtonPress={closeModal}
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      style={styles.modalStyle}
      {...props}>
      <View style={styles.modalWrapper(maxHeight)}>
        <View style={styles.modalSlider}>
          <View style={styles.drag} />
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.titleStyle}>{title}</Text>
          {children}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  modalStyle: {margin: 0, justifyContent: 'flex-end'},
  modalWrapper: (maxHeight) => ({
    height: screenHeight * 0.9,
    maxHeight: maxHeight,
  }),
  modalContent: {
    backgroundColor: colors.disable,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
  },
  modalSlider: {
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    paddingTop: 25,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  drag: {
    backgroundColor: colors.white,
    width: 35,
    height: 5,
    borderRadius: 10,
  },
  titleStyle: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
