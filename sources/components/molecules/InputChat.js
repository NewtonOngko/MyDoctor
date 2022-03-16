import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, fonts} from '../../utils';
import {Button} from '../atoms';

const InputChat = ({value, onChangeText, onButtonPress, disabled}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        multiline
        onChangeText={onChangeText}
        // placeholder="Tulis pesanmu untuk dokter A"
      />
      <Button
        title="Send"
        type="btn-icon-send"
        onPress={onButtonPress}
        disabled={disabled}
      />
    </View>
  );
};

export default InputChat;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    backgroundColor: colors.disable,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    fontFamily: fonts.primary.normal,
    maxHeight: 100,
  },
});
