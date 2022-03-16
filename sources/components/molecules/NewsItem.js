import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ILNullPhoto} from '../../assets';
import {colors, mStyles} from '../../utils';
import fontStyles from '../../utils/fonts';

const NewsItem = ({title, date, image, onPress}) => {
  image = image ? {uri: image} : ILNullPhoto;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
};

export default NewsItem;

const styles = StyleSheet.create({
  container: {
    ...mStyles.centerVerticalInline,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingBottom: 10,
    marginBottom: 10,
    flex: 1,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    ...fontStyles.heading,
    color: colors.text.primary,
    maxWidth: '90%',
    flex: 1,
  },
  date: {...fontStyles.caption, color: colors.text.secondary, marginTop: 4},
  image: {width: 80, height: 60, borderRadius: 11},
});
