import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ILCatObat, ILCatPsikiater, ILCatUmum} from '../../assets';
import {colors, fonts} from '../../utils';
import fontStyles from '../../utils/fonts';

const DoctorCategory = ({category, onPress}) => {
  const Icon = () => {
    if (category === 'Dokter Umum') {
      return <ILCatUmum style={styles.illustration} />;
    }
    if (category === 'Psikiater') {
      return <ILCatPsikiater style={styles.illustration} />;
    }
    if (category === 'Dokter Obat') {
      return <ILCatObat style={styles.illustration} />;
    }
    return <ILCatUmum style={styles.illustration} />;
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.category} numberOfLines={2} ellipsizeMode="tail">
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCategory;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cardlight,
    alignSelf: 'flex-start',
    marginRight: 10,
    borderRadius: 10,
    width: 110,
    height: 120,
  },
  illustration: {
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.primary,
  },
  category: {
    ...fontStyles.heading,
    color: colors.black,
  },
});
