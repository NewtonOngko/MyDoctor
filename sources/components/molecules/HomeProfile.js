import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ILNullPhoto} from '../../assets';
import {colors, fonts, getStorageItem, mStyles} from '../../utils';
import fontStyles from '../../utils/fonts';

const HomeProfile = ({}) => {
  const [greetingText, setGreetingText] = useState('');
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState('');

  let isFocus = useIsFocused();
  useEffect(() => {
    getStorageItem('user_data').then((res) => {
      setFullName(res.full_name);
      setPhoto(res.profile_picture);
    });
    configDesc();
  }, [isFocus]);

  const configDesc = () => {
    let currentHour = moment().hour();
    let isInMorningHourRange = currentHour >= 5 && currentHour <= 11;
    let isInAfternoonHourRange = currentHour >= 12 && currentHour <= 16;
    let isInEveningHourRange =
      (currentHour >= 0 && currentHour <= 4) ||
      (currentHour >= 17 && currentHour <= 23);

    const morningTexts = [
      "So, what's your plan for the day?",
      'Go get ready, the sun is up!',
      'How are you feeling today?',
      "Don't forget to drink your water!",
      'Glad to see you here ! Grab your coffee and start your day',
    ];

    const afternoonTexts = [
      "It's lunchtime. Don't forget to eat!.",
      'Relax and take it easy today, okay?',
    ];

    const eveningTexts = [
      'Hang on there! You will get through this!',
      'How was your day? I hope it went great.',
      "Don't stay up too late!",
      'Have you seen the mirror? You look amazing today!',
    ];

    let data;
    let randomIndex;
    let text;

    if (isInAfternoonHourRange) {
      data = afternoonTexts;
      text = 'Good Afternoon, ';
    } else if (isInEveningHourRange) {
      data = eveningTexts;
      text = 'Good Evening, ';
    } else if (isInMorningHourRange) {
      data = morningTexts;
      text = 'Good Morning, ';
    }

    randomIndex = Math.floor(Math.random() * data.length);
    setGreetingText(text + data[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Image
        source={photo ? {uri: photo} : ILNullPhoto}
        style={styles.avatar}
      />
      <View style={{flex: 1}}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.profession}>{greetingText}</Text>
      </View>
    </View>
  );
};

export default HomeProfile;

const styles = StyleSheet.create({
  container: {...mStyles.centerVerticalInline},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 12,
  },
  name: {
    ...fontStyles.heading,
    ...fontStyles.nunitoBold,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  profession: {...fontStyles.heading, color: colors.text.secondary},
});
