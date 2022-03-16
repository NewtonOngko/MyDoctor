import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Gap, Header, Loading} from '../components';
import {getTransactionList} from '../config';
import {
  getStorageItem,
  newColors,
  numberPrettier,
  SnackBar,
  useMoment,
} from '../utils';
import fontStyles from '../utils/fonts';
import {mStyles} from '../utils/styling';

const OrderDoctor = ({navigation, route}) => {
  let type = route.params.type ? route.params.type : '';
  let doctorData = route.params.data ? route.params.data : '';
  let headerTitle = type === 'Consultation' ? 'Consultation' : 'Appointment';
  let amount = type === 'Consultation' ? 50000 : 50000;

  const [user, setUser] = useState(null);
  const [orderNo, setOrderNo] = useState(null);
  const [listOrder, setListOrder] = useState(null);
  const [selectedValue, setSelectedValue] = useState(-1);

  const startDate = moment().add(1, 'day').format('YYYY-MM-DD');
  const endDate = moment().add(2, 'day').format('YYYY-MM-DD');

  const startDateUnix = moment(startDate).unix();
  const endDateUnix = moment(endDate).unix();

  useEffect(() => {
    getStorageItem('user_data')
      .then((res) => {
        setUser(res);
        setOrderNo(`${moment().unix().toString()}-user-${res.user_id}`);
      })
      .catch((err) => console.log(err.data));

    getTransactionList()
      .then((res) => {
        let tempData = res.filter(
          (item) =>
            item.doctor_id === doctorData.doctor_id &&
            item.transaction_status === 'accept',
        );
        let tempArr = [];
        tempData.map((item) => {
          if (item.transaction_date) {
            let data = moment(item.transaction_date).unix().toString();
            if (data >= startDateUnix && data <= endDateUnix) {
              let dateItem = moment(item.transaction_date).format('HH:mm');
              tempArr.push(dateItem);
            }
          }
        });
        setListOrder(tempArr);
      })
      .catch((err) => console.log(err.data));
  }, [doctorData.doctor_id, endDateUnix, startDateUnix]);

  return (
    <>
      <Header title={headerTitle} onPress={() => navigation.goBack()} />
      {!user || !listOrder ? (
        <Loading />
      ) : (
        <ScrollView
          style={mStyles.container}
          contentContainerStyle={styles.scrollContainer}>
          <View style={mStyles.container}>
            <>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderNumber}>Transaction ID</Text>
                <Text style={styles.orderNumber}>{orderNo}</Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Transaction Date</Text>
                <Text style={styles.orderDesc}>
                  {moment().format('MMM DD, YYYY')}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Order By</Text>
                <Text style={styles.orderDesc}>
                  {user ? user.full_name : ''}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Type</Text>
                <Text style={[styles.orderDesc, fontStyles.nunitoBold]}>
                  {type}
                </Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Doctor</Text>
                <Text style={styles.orderDesc}>{doctorData.full_name}</Text>
              </View>
              <View style={styles.orderIDWrapper}>
                <Text style={styles.orderDesc}>Pricing</Text>
                <Text style={styles.orderDesc}>
                  Rp {numberPrettier(amount)}
                </Text>
              </View>
              <Gap height={15} />
            </>
            <Text style={fontStyles.title1}>
              {type} on {moment(startDateUnix * 1000).format('MMM DD, YYYY')}
            </Text>

            <FlatList
              data={new Array(9).fill(0)}
              contentContainerStyle={{marginHorizontal: -5}}
              numColumns="3"
              renderItem={({item, index}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                let time = useMoment((2 + index) * 3600 * 1000, false, 'HH:mm');
                let isSelected = selectedValue === time;
                let hasBeenOrdered = listOrder.includes(time);
                let isDisableText = isSelected || hasBeenOrdered;

                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (hasBeenOrdered) {
                        return SnackBar(
                          'Doctor not available on that time.',
                          'danger',
                        );
                      }
                      setSelectedValue(time);
                    }}
                    style={styles.timeWrapper(isSelected, hasBeenOrdered)}>
                    <Text style={styles.timeTextStyle(isDisableText)}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Button
            title="Proceed"
            type="primary"
            disabled={selectedValue === -1}
            onPress={() => {
              let date = `${startDate} ${selectedValue}`;
              navigation.navigate('Checkout', {
                type,
                doctorData,
                user,
                invNo: orderNo,
                amount,
                date,
              });
            }}
          />
        </ScrollView>
      )}
    </>
  );
};

export default OrderDoctor;

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderIDWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderNumber: {...fontStyles.heading},
  orderDesc: {
    ...fontStyles.nunitoRegular,
    fontSize: 15,
  },
  timeWrapper: (isSelected, hasBeenOrdered) => ({
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: hasBeenOrdered
      ? newColors.dustyGray
      : isSelected
      ? newColors.brightTurquiose
      : newColors.pureWhite,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1 / 3,
    borderWidth: 1,
    borderColor: hasBeenOrdered
      ? newColors.dustyGray
      : newColors.brightTurquiose,
  }),
  timeTextStyle: (isSelected) => ({
    color: isSelected ? newColors.pureWhite : newColors.carbonBlack,
    ...fontStyles.body1,
  }),
});
