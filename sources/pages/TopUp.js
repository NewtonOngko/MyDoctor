import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {BottomSheet, Button, Gap, Header} from '../components';
import {topUp} from '../config';
import {
  getStorageItem,
  mStyles,
  newColors,
  numberPrettier,
  screenHeight,
  SnackBar,
} from '../utils';
import fontStyles from '../utils/fonts';

const TopUp = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [selectedItem, setSelectedItem] = useState(10000);
  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStorageItem('user_data')
      .then((res) => {
        setUser(res);
        let walletAmount = res.wallet ? res.wallet : 0;
        setBalance(walletAmount);
      })
      .catch((err) => console.log(err.data));
  }, []);

  const nominal = [10000, 20000, 25000, 50000, 75000, 100000];

  const Item = ({item, index}) => {
    let isSelected = item === selectedItem;
    let iconColor = isSelected
      ? newColors.brightTurquiose
      : newColors.blueBayoux;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.1}
        style={styles.itemTopupWrapper(isSelected)}
        onPress={() => setSelectedItem(item)}>
        <Icon
          type="material-community"
          name="cash"
          size={30}
          color={iconColor}
        />
        <Text style={styles.topupValue}>{numberPrettier(item, 'pricing')}</Text>
      </TouchableOpacity>
    );
  };

  const handleTopUp = () => {
    setIsLoading(true);
    let data;
    data = {
      order_id: `topup-${moment().unix().toString()}-user-${user.user_id}`,
      user_id: user.user_id,
      gross_amount: selectedItem,
    };

    topUp(data)
      .then((res) => {
        let linkData = res.data.transactionRedirectUrl;
        setIsLoading(false);
        setIsShowingDialog(false);
        navigation.replace('Web View', {url: linkData, type: 'topup'});
      })
      .catch((err) => {
        console.log(err.data);
        setIsLoading(false);
        setIsShowingDialog(false);
        SnackBar(err.data.message, 'danger');
      });
  };

  return (
    <>
      <BottomSheet
        showModal={isShowingDialog}
        title="Order Confirmation"
        maxHeight={350}
        closeModal={() => setIsShowingDialog(false)}>
        <View style={styles.bottomSheetContentWrapper}>
          <>
            <View style={styles.bottomSheetLabelWrapper}>
              <Text style={styles.bottomSheetLabel}>Amount</Text>
              <Text style={styles.bottomSheetValue}>
                {numberPrettier(selectedItem, 'pricing')}
              </Text>
            </View>
            <View style={styles.bottomSheetLabelWrapper}>
              <Text style={styles.bottomSheetLabel}>Additional Fee</Text>
              <Text style={styles.bottomSheetValue}>
                {numberPrettier(0, 'pricing')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottomSheetLabelWrapper}>
              <Text style={styles.bottomSheetLabel}>Total Payment</Text>
              <Text style={styles.bottomSheetValue}>
                {numberPrettier(selectedItem, 'pricing')}
              </Text>
            </View>
            <View style={mStyles.container} />
            <Gap height={15} />
          </>
          <Button
            type="primary"
            title="Proceed to Payment"
            disabled={!user}
            isLoading={isLoading}
            onPress={handleTopUp}
          />
          <Button
            type="secondary"
            title="Cancel"
            onPress={() => setIsShowingDialog(false)}
          />
        </View>
      </BottomSheet>
      <Header title="Top Up Wallet" onPress={() => navigation.goBack()} />
      <FlatList
        data={nominal}
        numColumns="3"
        renderItem={Item}
        ListHeaderComponent={
          <>
            <View style={styles.balanceWrapper}>
              <Text style={styles.balanceText}>Balance</Text>
              <Text style={styles.balanceValue}>
                {numberPrettier(balance, 'pricing')}
              </Text>
            </View>
            <Text style={styles.amoutToTopupText}>Select Amout to Topup:</Text>
          </>
        }
        ListHeaderComponentStyle={{}}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContainer}
        ListFooterComponentStyle={styles.footerStyle}
        ListFooterComponent={
          <Button
            title={`Proceed ${numberPrettier(selectedItem, 'pricing')}`}
            type="primary"
            buttonCustomStyle={{marginHorizontal: 16}}
            onPress={() => setIsShowingDialog(true)}
          />
        }
      />
    </>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingBottom: 20,
  },
  balanceWrapper: {
    height: 200,
    backgroundColor: newColors.brightTurquiose,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {...fontStyles.title2, color: newColors.pureWhite},
  balanceValue: {...fontStyles.title4, color: newColors.pureWhite},
  itemTopupWrapper: (isSelected) => ({
    backgroundColor: newColors.pureWhite,
    marginHorizontal: 8,
    borderRadius: 10,
    borderColor: isSelected ? newColors.brightTurquiose : newColors.dustyGray,
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  columnWrapper: {marginHorizontal: -8, paddingHorizontal: 16},
  footerStyle: {flex: 1, justifyContent: 'flex-end'},
  topupValue: {...fontStyles.heading},
  amoutToTopupText: {
    paddingHorizontal: 16,
    ...fontStyles.heading,
    marginBottom: 2,
  },
  bottomSheetContentWrapper: {
    backgroundColor: newColors.pureWhite,
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: newColors.dustyGray,
    marginVertical: 10,
  },
  bottomSheetLabelWrapper: {
    ...mStyles.centerVerticalInline,
    justifyContent: 'space-between',
  },
  bottomSheetLabel: {
    ...fontStyles.body1,
    marginBottom: 5,
  },
  bottomSheetValue: {
    ...fontStyles.body1,
    marginBottom: 5,
  },
});
