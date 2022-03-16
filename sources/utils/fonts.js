import {StyleSheet} from 'react-native';

export const fonts = {
  primary: {
    200: 'Nunito-ExtraLight',
    300: 'Nunito-Light',
    400: 'Nunito-Regular',
    600: 'Nunito-SemiBold',
    700: 'Nunito-Bold',
    800: 'Nunito-ExtraBold',
    900: 'Nunito-Black',
    normal: 'Nunito-Regular',
  },
};

const nunitoFonts = {
  nunitoLight: {
    fontFamily: 'Nunito-Light',
  },
  nunitoRegular: {
    fontFamily: 'Nunito-Regular',
  },
  nunitoSemibold: {
    fontFamily: 'Nunito-SemiBold',
  },
  nunitoBold: {
    fontFamily: 'Nunito-Bold',
  },
};

const typography = {
  overline: {
    fontSize: 10,
    ...nunitoFonts.nunitoSemibold,
  },
  caption: {
    ...nunitoFonts.nunitoRegular,
    fontSize: 12,
  },
  body1: {
    fontSize: 14,
    ...nunitoFonts.nunitoRegular,
    lineHeight: 18,
  },
  heading: {
    ...nunitoFonts.nunitoSemibold,
    fontSize: 16,
  },
  title1: {
    ...nunitoFonts.nunitoSemibold,
    fontSize: 20,
    lineHeight: 25,
  },
  title2: {
    ...nunitoFonts.nunitoSemibold,
    fontSize: 20,
  },
  title3: {
    ...nunitoFonts.nunitoSemibold,
    fontSize: 24,
  },
  title4: {
    ...nunitoFonts.nunitoBold,
    fontSize: 30,
  },
};

const fontStyles = StyleSheet.create({
  ...nunitoFonts,
  ...typography,
});

export default fontStyles;
