const mainColors = {
  green1: '#0BCAD4',
  green2: '#EDFCFD',
  dark1: '#112340',
  dark2: '#495A75',
  dark3: '#8092AF',
  grey1: '#7D8797',
  grey2: '#C9C9C9',
  grey3: '#EDEEF0',
  grey4: '#B1B7C2',
  blue1: '#0066CB',
  black1: '#000000',
  black2: 'rgba(0,0,0,0.5)',
  red1: '#E06379',
};

export const newColors = {
  blueBayoux: '#495A75',
  blueZodiac: '#112340',
  brightTurquiose: '#0BCAD4',
  foam: '#EDFCFD',
  pureWhite: '#FFFFFF',
  tomatoRed: '#EB5757',
  carbonBlack: '#112340',
  dustyGray: '#B1B7C2',
  cheddarOrange: '#FFAA06',
  broccoliGreen: '#27AE60',
};

export const colors = {
  primary: newColors.brightTurquiose,
  secondary: newColors.blueZodiac,
  white: newColors.pureWhite,
  black: newColors.carbonBlack,

  tertiary: mainColors.blue1,
  disable: mainColors.grey3,
  text: {
    primary: mainColors.dark1,
    secondary: mainColors.grey1,
    menuInactive: mainColors.dark2,
    menuActive: mainColors.green1,
    subTitle: mainColors.dark3,
  },
  button: {
    primary: {
      background: mainColors.green1,
      text: 'white',
    },
    secondary: {
      background: 'white',
      text: mainColors.dark1,
    },
    disable: {
      background: mainColors.grey3,
      text: mainColors.grey4,
    },
  },
  border: mainColors.grey2,
  link: mainColors.grey1,
  cardlight: mainColors.green2,
  loadingBackground: mainColors.black2,
  error: mainColors.red1,
};
