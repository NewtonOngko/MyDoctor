import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ILNullPhoto} from '../../../assets';
import {colors, fonts} from '../../../utils';

const OtherChat = ({photo, message, time}) => {
  photo = photo ? photo : ILNullPhoto;
  return (
    <View style={styles.container}>
      <Image source={photo} style={styles.avatar} />
      <View>
        <View style={styles.chatContent}>
          <Text style={styles.text}>{message}</Text>
        </View>
        <Text style={styles.date}>{time}</Text>
      </View>
    </View>
  );
};

export default OtherChat;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'flex-end',
    paddingLeft: 16,
    flexDirection: 'row',
  },
  avatar: {width: 30, height: 30, borderRadius: 30 / 2, marginRight: 12},
  chatContent: {
    maxWidth: '80%',
    padding: 12,
    paddingLeft: 18,
    backgroundColor: colors.primary,
    // backgroundColor: 'red',
    borderRadius: 15,
    borderBottomLeftRadius: 0,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.primary.normal,
    color: colors.white,
  },
  date: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.secondary,
    // marginTop: 8,
  },
});
