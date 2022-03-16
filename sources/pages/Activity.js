import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import ReactNativeModal from 'react-native-modal';
import {Button, Gap, Loading} from '../components';
import {getTransactionList, setRating, updateTransaction} from '../config';
import {
  colors,
  fonts,
  getStorageItem,
  mStyles,
  newColors,
  numberPrettier,
  screenWidth,
  useMoment,
} from '../utils';
import fontStyles from '../utils/fonts';

const Activity = ({navigation}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rate, setRate] = useState(-1);
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [activities, setActivities] = useState(null);
  let isDataReady = doctors && user && activities;
  let isFocus = useIsFocused();
  let arrayStar = new Array(5).fill(0);

  const startDate = moment().format('YYYY-MM-DD');
  const startDateUnix = moment(startDate).unix();

  useEffect(() => {
    if (isFocus) {
      handleGetDoctors();

      getStorageItem('user_data')
        .then((res) => {
          setUser(res);
          handleGetTransactions(res.user_id);
        })
        .catch((err) => {
          console.log(err.data);
        });
    }
  }, [isFocus]);

  const handleGetDoctors = () => {
    getStorageItem('listDoctor')
      .then((res) => {
        setDoctors(res);
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  const handleSetRating = () => {
    let item = selectedTransaction;
    let data = {doctor_id: item.doctor_id, rating: rate};

    setIsLoadingRate(true);
    setRating(data)
      .then((res) => {
        console.log(res);

        updateTransaction(item.transaction_id, {has_rated: 1}).then((res) => {
          setIsLoadingRate(false);
          setIsShowingDialog(false);
        });
      })
      .catch((err) => {
        console.log(err.data);
        setIsLoadingRate(false);
      });
  };

  const handleGetTransactions = (userId) => {
    getTransactionList()
      .then((data) => {
        let tempData = [];
        data.map((item) => {
          let date = moment(item.transaction_date).unix();
          if (item.user_id === userId && date >= startDateUnix) {
            tempData.push(item);
          }
        });
        tempData = tempData.sort(
          (a, b) =>
            moment(a.transaction_date).unix() -
            moment(b.transaction_date).unix(),
        );
        setActivities(tempData);
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  const Item = ({item, index}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    let orderID = item.transaction_no;
    let transactionId = item.transaction_id;
    let scheduleDate = item.transaction_date;
    let hasRated = item.hasRated ? item.hasRated : false;

    let scheduledTime = moment(scheduleDate).unix() * 1000;
    let endScheduleTime = scheduledTime + 15 * 60 * 1000;

    let date = useMoment(scheduleDate, false, 'MMM DD, YYYY');
    let time = useMoment(scheduleDate, false, 'HH:mm');
    let total = item.amount;
    let type = item.transaction_type;
    let doctorId = item.doctor_id;

    let doctorIndex = doctors.findIndex(
      (doctor) => doctor.doctor_id === doctorId,
    );
    let doctorData = doctors[doctorIndex];
    let doctorName = doctorData.full_name;
    item.doctor = doctorData;
    let hospitalData = doctorData.hospitalData;
    let hospitalName = hospitalData.hospital_name;

    let status = item.transaction_status;

    const addString = (data) => {
      if (data < 10) {
        return (data = '0' + data.toString());
      }
      return data;
    };

    const handleUpdateStatus = (newStatus) => {
      updateTransaction(transactionId, newStatus)
        .then((res) => {
          console.log(res);
          console.log(newStatus);
          console.log(transactionId);
          handleGetTransactions(user.user_id);
        })
        .catch((err) => console.log(err.data));
    };

    useEffect(() => {
      let interval = 0;

      if (status !== 'finished' && status !== 'reject') {
        interval = setInterval(async () => {
          let differenceTime;
          if (status === 'accept' || status === 'pending') {
            differenceTime = scheduledTime - new Date().getTime();
          } else if (status === 'ongoing') {
            differenceTime = endScheduleTime - new Date().getTime();
          }
          if (differenceTime >= 0) {
            let duration = moment.duration(differenceTime);
            let durationHour = duration.hours();
            let durationMinute = duration.minutes();
            let durationSeconds = duration.seconds();

            durationHour = addString(durationHour);
            durationMinute = addString(durationMinute);
            durationSeconds = addString(durationSeconds);

            let combineDuration = `${durationHour}:${durationMinute}:${durationSeconds}`;

            setTimeLeft(combineDuration);
            if (differenceTime <= 3 * 60 * 60 * 1000 && status === 'pending') {
              handleUpdateStatus('accept');
            } else if (differenceTime <= 2000) {
              console.log('tinggal 2s');
              let upcomingStatus = 'finished';
              if (status === 'ongoing') {
                upcomingStatus = 'finished';
              } else if (status === 'accept') {
                upcomingStatus = 'ongoing';
              }
              handleUpdateStatus(upcomingStatus);
            }
          } else {
            if (endScheduleTime >= new Date().getTime) {
              console.log('not late');
              handleUpdateStatus('ongoing');
            } else if (new Date().getTime() > endScheduleTime) {
              handleUpdateStatus('finished');
            }
          }
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [endScheduleTime, scheduledTime, status]);

    return (
      <View style={styles.orderWrapper} key={index}>
        <View style={styles.orderIDWrapper}>
          <Text style={styles.orderIDText}>Order ID</Text>
          <Text style={styles.orderIDText}>{orderID}</Text>
        </View>
        <View style={styles.orderDescWrapper}>
          <Text style={styles.descLabel}>Status</Text>
          <Text style={styles.statusValue(status)}>{status}</Text>
        </View>
        <View style={styles.orderDescWrapper}>
          <Text style={styles.descLabel}>Order Date</Text>
          <Text style={styles.descValue}>{date}</Text>
        </View>
        <View style={styles.orderDescWrapper}>
          <Text style={styles.descLabel}>Order Time</Text>
          <Text style={styles.descValue}>{time}</Text>
        </View>
        <View style={styles.orderDescWrapper}>
          <Text style={styles.descLabel}>Activity Type</Text>
          <Text style={[styles.descValue, {textTransform: 'capitalize'}]}>
            {type}
          </Text>
        </View>
        <View style={styles.orderDescWrapper}>
          <Text style={styles.descLabel}>Doctor's name</Text>
          <Text style={styles.descValue}>{doctorName}</Text>
        </View>
        {type !== 'consultation' && (
          <View style={styles.orderDescWrapper}>
            <Text style={styles.descLabel}>Hospital</Text>
            <Text style={styles.descValue}>{hospitalName}</Text>
          </View>
        )}
        <View style={styles.orderDescWrapper}>
          <Text style={styles.grandTotal}>Total</Text>
          <Text style={styles.grandTotal}>
            {numberPrettier(total, 'pricing')}
          </Text>
        </View>
        {status === 'ongoing' && type === 'consultation' && (
          <View style={styles.orderDescWrapper}>
            <Text style={styles.grandTotal}>Duration</Text>
            <Text style={styles.grandTotal}>{timeLeft}</Text>
          </View>
        )}

        <Gap height={5} />
        {status === 'ongoing' && type === 'consultation' && (
          <Button
            title="Consult"
            type="primary"
            buttonCustomStyle={{alignSelf: 'flex-end'}}
            onPress={() => {
              navigation.navigate('Chat', {
                data: item,
                user: user,
                endScheduleTime,
              });
            }}
          />
        )}
        {status === 'finished' && !item.description && (
          <Text style={{flex: 1}}>
            Perlunya istirahat yang secukupnya, kurangi makanan yang berminyak
          </Text>
        )}
        {/* {status === 'finished' && type === 'consultation' && !hasRated && (
          <Button
            title="Rate"
            type="primary"
            buttonCustomStyle={{alignSelf: 'flex-end'}}
            onPress={() => {
              setRate(-1);
              setSelectedTransaction(item);
              setIsShowingDialog(true);
            }}
          />
        )} */}
      </View>
    );
  };

  return (
    <View style={mStyles.page}>
      <View style={mStyles.content}>
        <ReactNativeModal
          isVisible={isShowingDialog}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.dialogRateWrapper}>
            <Text style={styles.rateModalText}>How is your Consultation?</Text>
            <View style={styles.rateWrapper}>
              {arrayStar.map((item, index) => {
                let colorStar =
                  index <= rate ? newColors.cheddarOrange : newColors.dustyGray;
                return (
                  <TouchableOpacity
                    onPress={() => setRate(index + 1)}
                    activeOpacity={0.5}>
                    <Icon
                      type="material-community"
                      name="star"
                      size={50}
                      color={colorStar}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <Button
              type="primary"
              title="Rate"
              disabled={rate < 0 || isLoadingRate}
              loading={isLoadingRate}
              onPress={() => {
                handleSetRating();
              }}
            />
          </View>
        </ReactNativeModal>
        <ScrollView
          style={mStyles.container}
          contentContainerStyle={styles.scrollContainer}>
          <View style={{}}>
            {!isDataReady && <Loading />}
            {isDataReady &&
              activities.length > 0 &&
              activities.map((item, index) => {
                return <Item item={item} index={index} />;
              })}
            {isDataReady && activities.length <= 0 && (
              <Text>You don't have any activity</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  ///
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flex: 1,
  },
  flatlistContainer: {
    flexGrow: 1,
    marginHorizontal: 16,
    paddingBottom: 50,
  },
  emptyDataWrapper: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
  },
  fab: {position: 'absolute', bottom: 10, right: 10},
  orderWrapper: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 10,
  },
  orderIDWrapper: {
    ...mStyles.displayInLine,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 5,
  },
  orderIDText: {fontFamily: fonts.primary[600], fontSize: 17},
  orderDescWrapper: {
    ...mStyles.displayInLine,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  descLabel: {fontFamily: fonts.primary.normal, fontSize: 15},
  descValue: {fontFamily: fonts.primary.normal, fontSize: 15},
  statusValue: (status) => ({
    fontFamily: fonts.primary.normal,
    fontSize: 13,
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor:
      status === 'accept'
        ? '#27AE60'
        : status === 'reject'
        ? newColors.tomatoRed
        : status === 'finished'
        ? '#7F83AB'
        : newColors.cheddarOrange,
    color: colors.white,
    textTransform: 'capitalize',
    borderRadius: 7,
  }),
  viewDetailText: {
    fontFamily: fonts.primary.normal,
    color: colors.primary,
    fontSize: 12,
  },
  grandTotal: {fontFamily: fonts.primary[600], fontSize: 16},
  listItemQty: {fontFamily: fonts.primary[300], fontSize: 12, flex: 1},
  listItemText: {fontFamily: fonts.primary[300], fontSize: 12, flex: 8},
  itemDetailText: {
    ...fontStyles.nunitoRegular,
    fontSize: 12,
    flex: 1,
    paddingLeft: 15,
    marginTop: -2,
  },

  //
  dialogRateWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: newColors.pureWhite,
    width: screenWidth * 0.8,
    // aspectRatio: 1,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  rateWrapper: {
    ...mStyles.centerVerticalInline,
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  rateModalText: {
    textAlign: 'center',
    ...fontStyles.nunitoBold,
    ...fontStyles.heading,
  },
});
