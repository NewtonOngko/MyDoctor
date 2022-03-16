import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import ReactNativeModal from 'react-native-modal';
import {newColors, screenWidth} from '../../utils';
import fontStyles from '../../utils/fonts';
import {Button} from '../atoms';

function ContentPicker({
  isVisible,
  closeContentPicker,
  mediaType = 'photo',
  onSuccess = (res) => {
    console.log('success pick content');
  },
}) {
  const onTakePhoto = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (!response.didCancel) {
          onSuccess({...response});
        }
        closeContentPicker();
      },
    );
  };

  const onChoosePhotoFromGalery = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (!response.didCancel) {
          onSuccess({...response});
        }
        closeContentPicker();
      },
    );
  };

  const onTakeVideo = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'video',
        includeBase64: false,
      },
      (response) => {
        if (!response.didCancel) {
          response.fileName = response.fileName.replace(/^.*[\\\/]/, '');
          onSuccess({...response});
        }
        closeContentPicker();
      },
    );
  };

  const onChooseVideoFromGallery = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'video',
        durationLimit: 60,
        includeBase64: true,
      },
      (response) => {
        console.log(response);
        if (!response.didCancel) {
          response.fileName = response.fileName.replace(/^.*[\\\/]/, '');
          onSuccess({...response});
        }
        closeContentPicker();
      },
    );
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackButtonPress={closeContentPicker}
      onBackdropPress={closeContentPicker}>
      <View style={styles.selectContentWrapper}>
        <Text style={styles.label}>Select Content</Text>
        <>
          <Button
            type="primary"
            title={`Take ${mediaType === 'photo' ? 'Photo' : 'Video'}`}
            onPress={mediaType === 'photo' ? onTakePhoto : onTakeVideo}
          />
          <Button
            type="secondary"
            title={'Choose from Gallery'}
            onPress={
              mediaType === 'photo'
                ? onChoosePhotoFromGalery
                : onChooseVideoFromGallery
            }
          />
        </>
        <Text onPress={closeContentPicker} style={styles.modalCancelText}>
          Cancel
        </Text>
      </View>
    </ReactNativeModal>
  );
}

export default ContentPicker;

const styles = StyleSheet.create({
  selectContentWrapper: {
    width: screenWidth * 0.8,
    padding: 20,
    borderRadius: 10,
    backgroundColor: newColors.pureWhite,
    alignSelf: 'center',
  },
  modalCancelText: {
    ...fontStyles.body1,
    // ...mStyles.textSilverGray,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  label: {
    // ...mStyles.textMeteoroidPurple,
    ...fontStyles.body1,
    marginBottom: 10,
    textAlign: 'center',
  },
});
