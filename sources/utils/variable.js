import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BASE_LINK = 'http:\\192.168.1.8:8081';

export {screenHeight, screenWidth, BASE_LINK};
