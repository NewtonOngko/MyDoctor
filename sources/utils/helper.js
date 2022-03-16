import storage from '@react-native-firebase/storage';
import {ToastAndroid} from 'react-native';
import fontStyles from './fonts';
import moment from 'moment';

const {showMessage} = require('react-native-flash-message');

const parseToArray = (listData) => {
  let array = [];
  Object.keys(listData).map((key) => {
    array = [...array, {id: key, data: listData[key]}];
  });
  return array;
};

const SnackBar = (message, type) => {
  // type= "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray).
  // let typeColor = colors.primary;
  // switch (type.toString().toLowerCase()) {
  // case 'success':
  //   snackbarType = {
  //     background: colors.cloverGreen,
  //     text: colors.broccoliGreen,
  //   };
  // break;

  showMessage({
    message: message,
    type: type,
    titleStyle: {...fontStyles.heading},
    textStyle: {...fontStyles.heading},
    duration: 3000,
    // backgroundColor: typeColor,
    // color: colors.white,
  });
};

const toast = (message) => {
  ToastAndroid.show(message, 3000);
};

const numberPrettier = (number, type) => {
  let text = type === 'pricing' ? 'Rp. ' : '';
  text = text + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return text;
};

const uploadToStorage = async (imageUri, path) => {
  return new Promise((resolve, reject) => {
    let file = storage().ref().child(path).putFile(imageUri);

    file.on('state_changed', (snapshot) => {
      var progress =
        (snapshot.bytesTransferred / snapshot.totalBytes).toFixed(2) * 100;
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      console.log('Upload is ' + progress + '% done');
    });

    file.then(async () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      await file.snapshot.ref.getDownloadURL().then((downloadURL) => {
        resolve(downloadURL);
      });
    });
  });
};

const parseStrToObj = (str) => {
  var x = 'value';
  try {
    x = JSON.parse(str);
  } catch (e) {
    return null;
  }
  if (x.length) {
    return parseStrToObj(x);
  }
  return x;
};

const useMoment = (date, isUTC, customFormat) => {
  let dateParam = date ? date : new Date();
  let formatting = customFormat ? customFormat : 'YYYY-MM-DD HH:mm';
  if (isUTC) {
    return moment(dateParam).utc().format(formatting).toString();
  }
  return moment(dateParam).format(formatting).toString();
};

export {
  SnackBar,
  toast,
  parseToArray,
  numberPrettier,
  uploadToStorage,
  parseStrToObj,
  useMoment,
};
