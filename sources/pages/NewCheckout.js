import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Button, Gap, Header} from '../components';
import {createTransaction, updateUser} from '../config';
import {
  colors,
  fonts,
  mStyles,
  newColors,
  numberPrettier,
  screenWidth,
  SnackBar,
  useMoment,
} from '../utils';
import fontStyles from '../utils/fonts';

const NewCheckout = ({navigation, route}) => {
  const type = route.params.type ? route.params.type : '';
  const [isLoading, setIsLoading] = useState(false);

  const backAction = () => {
    if (isLoading) {
      return SnackBar('Transaction on process, cannot back to previous screen');
    }
    return navigation.goBack();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const PaymentScreen = ({data, res = () => {}}) => {
    const totalAmount = data.amount;

    const [orderNo, setOrderNo] = useState(data.invNo);
    const [user, setUser] = useState(data.user);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const [wallet, setWallet] = useState(0);

    let wallet = user.wallet;
    let isWalletEnough = wallet >= totalAmount;

    let selectedTime = data.date;
    let parsingDoctor = data.doctorData;
    let doctroName = parsingDoctor.full_name;
    let actionType = type === 'Consultation' ? 'Consultation' : 'Appointment';

    const handleUpdateWallet = () => {
      updateUser(user.user_id, {wallet: wallet - totalAmount})
        .then((response) => {
          res(false);
          setIsButtonLoading(false);
          navigation.reset({
            index: 0,
            routes: [{name: 'MainApp'}],
          });
        })
        .catch((err) => {
          console.log(err);
          res(false);
        });
    };

    const handleSubmitForm = () => {
      let _data = {
        transaction_no: orderNo,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        transaction_date: useMoment(selectedTime, true),
        user_id: user.user_id,
        doctor_id: parsingDoctor.doctor_id,
        amount: 50000,
        transaction_type: actionType.toLowerCase(),
        transaction_status: 'pending',
      };
      console.log(_data);
      res(true);
      setIsButtonLoading(true);

      createTransaction(_data)
        .then((response) => {
          handleUpdateWallet();
        })
        .catch((err) => {
          setIsButtonLoading(false);
          res(false);
          console.log(err.data);
        });
    };

    return (
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}>
          <>
            <>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderNumber}>Transaction ID</Text>
                <Text style={styles.orderNumber}>{orderNo}</Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Transaction Date</Text>
                <Text style={styles.orderDesc}>
                  {useMoment('', false, 'MMM DD, YYYY')}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>{type} Date</Text>
                <Text style={styles.orderDesc}>
                  {useMoment(selectedTime, false, 'MMM DD, YYYY')}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>{type} Time</Text>
                <Text style={styles.orderDesc}>
                  {useMoment(selectedTime, false, 'HH:mm')}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Order By</Text>
                <Text style={styles.orderDesc}>
                  {user ? user.full_name : ''}
                </Text>
              </View>
            </>
            <Text style={styles.summaryText}>Order Summary :</Text>
            <View style={styles.itemWrapper}>
              <View style={styles.container}>
                <Text style={styles.itemName}>
                  {doctroName} - {actionType}
                </Text>
                <Gap height={3} />
                <View style={styles.itemDescWrapper}>
                  <Text style={styles.itemLabel}>Price</Text>
                  <Text style={styles.itemValue}>
                    : {numberPrettier(totalAmount, 'pricing')}
                  </Text>
                </View>
                <View style={styles.itemDescWrapper}>
                  <Text style={styles.itemLabel}>
                    {actionType} on{' '}
                    {moment(selectedTime).format('MMM DD, YYYY (HH:mm)')}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemName}>
                {numberPrettier(totalAmount, 'pricing')}
              </Text>
            </View>
          </>
        </ScrollView>
        <View style={styles.submitOrderWrapper}>
          <View style={styles.grandTotalWrapper}>
            <Icon
              type="material-community"
              name="wallet"
              color={
                isWalletEnough ? newColors.brightTurquiose : newColors.tomatoRed
              }
            />
            <Text style={styles.grandTotal(isWalletEnough)}>
              {numberPrettier(wallet, 'pricing')}
            </Text>
          </View>
          <Button
            title="Confirm and Proceed"
            type="primary"
            disabled={!isWalletEnough}
            isLoading={isButtonLoading}
            onPress={handleSubmitForm}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <Header title="Checkout" onPress={backAction} />
      <PaymentScreen
        data={route.params}
        res={(response) => setIsLoading(response)}
      />
    </>
  );
};

export default NewCheckout;

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
    textTransform: 'capitalize',
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
    ...mStyles.centerVerticalInline,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 15,
  },
  itemName: {...fontStyles.body1, ...fontStyles.nunitoSemibold},
  totalPrice: {fontSize: 17},
  itemLabel: {
    flex: 1,
    fontFamily: fonts.primary[300],
  },
  itemValue: {
    flex: 3,
    fontFamily: fonts.primary[300],
  },
  grandTotal: (value) => ({
    fontFamily: fonts.primary[600],
    fontSize: 17,
    marginLeft: 5,
    color: value ? newColors.brightTurquiose : newColors.tomatoRed,
  }),
  grandTotalWrapper: {
    // justifyContent: 'space-between',
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
