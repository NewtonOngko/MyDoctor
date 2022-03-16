import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Input as RNEInput} from 'react-native-elements';
import {colors} from '../../utils';
import fontStyles from '../../utils/fonts';

const Input = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  disable,
  partialDisable,
  keyboardType = 'default',
}) => {
  const [border, setBorder] = useState(colors.border);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const onFocusForm = () => {
    setBorder(colors.tertiary);
  };
  const onBlurForm = () => {
    setBorder(colors.border);
  };
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <RNEInput
        onFocus={onFocusForm}
        onBlur={onBlurForm}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        containerStyle={{paddingHorizontal: 0}}
        inputContainerStyle={styles.inputContainer(border, disable)}
        editable={!(disable || partialDisable)}
        selectTextOnFocus={!(disable || partialDisable)}
        inputStyle={styles.inputStyle(disable)}
        errorStyle={styles.errorStyle}
        rightIconContainerStyle={{backgroundColor: 'red', marginRight: 15}}
        // rightIcon={
        //   secureTextEntry && (
        //     <Icon
        //       type="material-community"
        //       name="eye"
        //       size={24}
        //       onPress={() => setIsSecure((hasil) => !hasil)}
        //     />
        //   )
        // }
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 5,
    ...fontStyles.nunitoRegular,
  },
  inputContainer: (border, disable) => ({
    borderWidth: 1,
    borderColor: border,
    borderRadius: 10,
    backgroundColor: disable ? colors.button.disable.background : null,
  }),
  inputStyle: (disable) => ({
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...fontStyles.nunitoRegular,
    fontSize: 15,
    color: disable ? colors.button.disable.text : colors.black,
  }),
  errorStyle: {
    marginTop: 0,
    marginBottom: 0,
    height: 0,
  },
});
