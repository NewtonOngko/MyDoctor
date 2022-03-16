import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import ReactNativeModal from 'react-native-modal';
import {ILNullPhoto} from '../assets';
import {Button, Gap, Header, Loading} from '../components';
import FBase from '../config/FBase';
import {
  colors,
  fonts,
  fullDate,
  getStorageItem,
  numberPrettier,
  screenWidth,
  SnackBar,
} from '../utils';
import fontStyles from '../utils/fonts';

const Checkout = ({navigation, route}) => {
  let listItems = route.params ? route.params.data : [];
  let require = route.params ? route.params.require : false;
  const [orderNo, setOrderNo] = useState('');
  const [user, setUser] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [qtyItem, setQtyItem] = useState(0);
  const [isshowingDialog, setIsshowingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorReceipt, setDoctorReceipt] = useState(require ? '' : 'nothing');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  useEffect(() => {
    getTime();
    handleGetMe();
    calculateTotal();
  });

  const getTime = () => {
    setMinutes(('0' + moment().minutes().toString()).slice(-2));
    setSeconds(('0' + moment().seconds().toString()).slice(-2));
    setHours(('0' + moment().hours().toString()).slice(-2));
    setTimeStamp(moment().unix());
  };

  const handleGetMe = () => {
    getStorageItem('userData')
      .then((res) => {
        let uid = res.uid.substring(0, 5);
        setUser(res);
        setOrderNo(`${uid}-${timeStamp}`);
      })
      .catch((err) => console.log(err));
  };
  const getImageLibrary = () => {
    // ImagePicker.launchImageLibrary(
    //   {quality: 0.7, maxHeight: 100, maxWidth: 100},
    //   (res) => {
    //     if (res.didCancel || res.error) {
    //       !hasPhoto && SnackBar("Failed to set Doctor's Receipt", 'danger');
    //     } else {
    //       setDoctorReceipt(`data:${res.type};base64, ${res.data}`);
    //       setHasPhoto(true);
    //     }
    //   },
    // );
  };
  const handleSubmitForm = () => {
    setIsLoading(true);
    let orderPath = user ? `orders/${user.uid}` : 'orders/';
    let data = {
      orderID: orderNo,
      purchaseDate: timeStamp,
      date: fullDate,
      time: `${hours}:${minutes}:${seconds}`,
      item: listItems,
      total: grandTotal,
      itemCount: qtyItem,
      status: require ? 'Awaiting Confirmation' : 'Approved',
      doctorReceipt: doctorReceipt,
      permission: require,
    };
    FBase.database()
      .ref(orderPath)
      .push(data)
      .then((res) => {
        SnackBar('Order Success', 'success');
        setIsLoading(false);
        navigation.pop(2);
      });
  };
  const calculateTotal = () => {
    let _totalPrice = 0;
    let _qty = 0;
    listItems.map((item) => {
      _qty += item.qty;
      _totalPrice += item.price * item.qty;
    });
    setTotalPrice(_totalPrice);
    setGrandTotal(_totalPrice + 20000);
    setQtyItem(_qty);
  };
  return (
    <>
      <ReactNativeModal
        isVisible={isshowingDialog}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
        propagateSwipe
        onBackdropPress={() => setIsshowingDialog(false)}
        onBackButtonPress={() => setIsshowingDialog(false)}>
        <View style={styles.dialogWrapper}>
          <Icon
            type="material-community"
            name="alert"
            size={80}
            color={'#FFAA06'}
          />
          <Text style={styles.dialogText}>
            Are you sure to Cancel this order?
          </Text>
          <Button
            title="Proceed Order"
            type="primary"
            onPress={() => setIsshowingDialog(false)}
          />
          <Button
            title="Cancel Order"
            onPress={() => {
              setIsshowingDialog(false);
              navigation.goBack();
            }}
          />
        </View>
      </ReactNativeModal>
      <Header title="Checkout" onPress={() => setIsshowingDialog(true)} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        {!user ? (
          <Loading />
        ) : (
          <>
            <>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderNumber}>Order ID</Text>
                <Text style={styles.orderNumber}>{orderNo}</Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Order Date</Text>
                <Text style={styles.orderDesc}>{fullDate}</Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Order Time</Text>
                <Text style={styles.orderDesc}>
                  {hours}:{minutes}:{seconds}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Order By</Text>
                <Text style={styles.orderDesc}>
                  {user ? user.fullName : ''}
                </Text>
              </View>
            </>
            <Text style={styles.summaryText}>Order Summary :</Text>
            {listItems.map((item, index) => {
              let totalPriceItem = item.qty * item.price;
              let image = item.image ? {uri: item.image} : ILNullPhoto;
              let permission = item.permission;
              return (
                <View style={styles.itemWrapper} key={index}>
                  <View style={{justifyContent: 'center'}}>
                    <Image source={image} style={styles.medicineImage} />
                  </View>
                  <View style={styles.container}>
                    <Text style={styles.itemName}>
                      {item.itemName}
                      {permission && (
                        <Text style={{color: colors.error}}> *</Text>
                      )}
                    </Text>
                    <View style={styles.itemDescWrapper}>
                      <Text style={styles.itemLabel}>Price</Text>
                      <Text style={styles.itemValue}>
                        : {numberPrettier(item.price, 'pricing')}
                      </Text>
                    </View>
                    <View style={styles.itemDescWrapper}>
                      <Text style={styles.itemLabel}>Qty</Text>
                      <Text style={styles.itemValue}>: {item.qty}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.totalPrice}>
                      {numberPrettier(totalPriceItem, 'pricing')}
                    </Text>
                  </View>
                </View>
              );
            })}
            <Gap height={5} />
            {require && (
              <View style={{marginBottom: 10}}>
                <Text style={styles.noteStyle}>
                  Note: (*) is for medicine that require doctor's receipt
                </Text>
                <Text style={styles.doctorReceiptText}>Doctor's Receipt</Text>
                <TouchableOpacity
                  onPress={getImageLibrary}
                  style={{alignSelf: 'flex-start'}}>
                  {doctorReceipt === '' && require ? (
                    <Icon
                      type="material-community"
                      name="plus-box-outline"
                      size={60}
                      color={colors.button.disable.text}
                    />
                  ) : (
                    <Image
                      source={{uri: doctorReceipt}}
                      style={styles.receiptImage}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
            <>
              <View style={styles.summaryWrapper}>
                <Text style={styles.orderDesc}>Total Price</Text>
                <Text style={styles.orderDesc}>
                  {numberPrettier(totalPrice, 'pricing')}
                </Text>
              </View>
              <View style={styles.summaryWrapper}>
                <Text style={styles.orderDesc}>Delivery Fee</Text>
                <Text style={styles.orderDesc}>
                  {numberPrettier(20000, 'pricing')}
                </Text>
              </View>
            </>
          </>
        )}
      </ScrollView>
      <View>
        <View style={styles.submitOrderWrapper}>
          <View style={styles.grandTotalWrapper}>
            <Text style={styles.grandTotal}>Grand Total</Text>
            <Text style={styles.grandTotal}>
              {numberPrettier(grandTotal, 'pricing')}
            </Text>
          </View>
          <Button
            title="Confirm and Proceed"
            type="primary"
            disabled={(require && !doctorReceipt) || !user}
            isLoading={isLoading}
            onPress={handleSubmitForm}
          />
        </View>
      </View>
    </>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderNumber: {
    fontFamily: fonts.primary[600],
    fontSize: 18,
  },
  orderDesc: {
    ...fontStyles.nunitoRegular,
    fontSize: 15,
  },
  summaryText: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
    marginTop: 15,
  },
  orderIDWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  medicineImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 10,
  },
  itemWrapper: {
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  itemName: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 17,
  },
  itemLabel: {
    flex: 1,
    fontFamily: fonts.primary[300],
  },
  itemValue: {
    flex: 3,
    fontFamily: fonts.primary[300],
  },
  grandTotal: {
    fontFamily: fonts.primary[600],
    fontSize: 17,
  },
  grandTotalWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dialogWrapper: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    width: screenWidth * 0.8,
    maxHeight: screenWidth * 0.8,
    alignSelf: 'center',
  },
  dialogText: {
    marginVertical: 10,
    fontFamily: fonts.primary[600],
    fontSize: 16,
    alignSelf: 'center',
  },
  itemDescWrapper: {flexDirection: 'row', alignItems: 'center'},
  submitOrderWrapper: {
    marginTop: 3,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  noteStyle: {
    marginBottom: 5,
    color: colors.error,
    fontFamily: fonts.primary.normal,
    fontSize: 13,
    fontStyle: 'italic',
  },
  doctorReceiptText: {
    fontFamily: fonts.primary[600],
    marginVertical: 5,
  },
  receiptImage: {width: 60, aspectRatio: 1, borderWidth: 0.5},
});
