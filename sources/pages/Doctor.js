import {useIsFocused} from '@react-navigation/native';
import * as geolib from 'geolib';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import {HospitalBanner} from '../assets/images';
import {
  DoctorCategory,
  Gap,
  HomeProfile,
  ListRecDoctor,
  Loading,
  NewsItem,
} from '../components';
import {
  getListDoctors,
  getListHospitals,
  getNews,
  getRecomendations,
  getUser,
  setDistance,
} from '../config';
import {
  colors,
  getStorageItem,
  mStyles,
  newColors,
  numberPrettier,
  screenWidth,
  setStorageItem,
} from '../utils';
import fontStyles from '../utils/fonts';

const Doctor = ({navigation}) => {
  const [news, setNews] = useState(null);
  const [doctorCategories, setDoctorCategories] = useState([
    // {id: 1, category: 'Dokter Umum'},
  ]);
  const [topDoctors, setTopDoctors] = useState(null);
  const [pinPosition, setPinPosition] = useState(null);
  const [listHospitals, setListHospitals] = useState(null);
  const [listDoctors, setListDoctors] = useState(null);

  const isFocus = useIsFocused();

  useEffect(() => {
    handleGetNews();
    handleGetListHospital();
    findMyCord();
    handleGetUser();
  }, [isFocus]);

  const handleGetUser = () => {
    getStorageItem('user_data').then((res) => {
      getUser(res.user_id).then((res) => {
        setStorageItem('user_data', res);
      });
    });
  };

  const handleGetNews = () => {
    getNews()
      .then((res) => {
        setNews(res);
        console.log('news done');
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  const handleGetListHospital = () => {
    getListHospitals()
      .then((res) => {
        setListHospitals(res);
        let tempData = [];
        for (let i = 0; i < res.length; i++) {
          let _data = res[i];
          let tempLocation = !(_data.latitude && _data.longitude)
            ? ''
            : {
                latitude: _data.latitude,
                longitude: _data.longitude,
              };

          let distance = !tempLocation
            ? 0
            : geolib.getDistance(pinPosition, tempLocation, 0.1);

          let newDistance = !distance ? 0 : distance;
          _data.distance = newDistance;
          tempData.push(_data);
        }
        tempData = tempData.sort((a, b) => a.distance - b.distance);
        setStorageItem('listHospital', tempData).then(() => {
          console.log('hospital done');
        });

        handleGetDoctors(tempData);
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  const handleGetDoctors = (hospitals) => {
    getListDoctors()
      .then((res) => {
        let categoryData = res.map((item) => item.specialist);
        categoryData = categoryData.filter(
          (item, index) => categoryData.indexOf(item) === index,
        );
        setDoctorCategories(categoryData);

        for (let i = 0; i < res.length; i++) {
          let hospitalId = res[i].hospital_id ? res[i].hospital_id : 1;
          let hospitalIndex = hospitals.findIndex(
            (item) => item.hospital_id === hospitalId,
          );
          res[i].hospitalData = hospitals[hospitalIndex];
        }
        setStorageItem('listDoctor', res).then(() => {
          setListDoctors(res);
          console.log('doctor done');
        });
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  const handleGetTopRatedDoctor = () => {
    getRecomendations()
      .then((res) => {
        setTopDoctors(res);
        console.log('recomend done');
      })
      .catch((err) => console.log(err.data));
  };

  const findMyCord = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        let userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setPinPosition(userPosition);
        console.log('coord done');
        handleSetCoord(userPosition);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        accuracy: {android: 'high'},
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  };

  const handleSetCoord = (data) => {
    setDistance(data)
      .then((res) => {
        console.log(res);
        handleGetTopRatedDoctor();
      })
      .catch((err) => console.log(err.data));
  };

  const RecommendedDoctors = () => {
    if (topDoctors && topDoctors.length > 0 && listHospitals && listDoctors) {
      return (
        <>
          <View style={styles.recDoctorLabelWrapper}>
            <Text style={styles.recommendedDoctor}>Recommended Doctor</Text>
            <Text
              style={styles.seeAllStyle}
              onPress={() => {
                // console.log(topDoctors);
                navigation.navigate('ListItemPages', {
                  type: 'doctor',
                  data: topDoctors,
                });
              }}>
              See All
            </Text>
          </View>
          {topDoctors.slice(0, 3).map((topDoctor, index) => {
            let doctorId = topDoctor.doctor_id;
            let doctorIndex = listDoctors.findIndex(
              (item) => item.doctor_id === doctorId,
            );
            let doctorData = listDoctors[doctorIndex];
            let hospitalId = parseInt(doctorData.hospital_id, 10);
            let hospitalIndex = listHospitals.findIndex(
              (item) => item.hospital_id === hospitalId,
            );
            let hospitalName = listHospitals[hospitalIndex].hospital_name;
            let doctorName = doctorData.full_name;
            let doctorPhoto = doctorData.profile_picture;
            let doctorProfession = doctorData.specialist;

            return (
              <ListRecDoctor
                key={index}
                name={`${doctorName}`}
                desc={doctorProfession}
                avatar={{uri: doctorPhoto}}
                hospital={hospitalName}
                onPress={() => {
                  navigation.navigate('DoctorProfile', {
                    data: listDoctors[doctorIndex],
                  });
                }}
              />
            );
          })}
        </>
      );
    }
    return <View />;
  };

  const NewsComponent = () => {
    if (news.length > 0) {
      return news.map((item) => {
        let date = moment(item.created_at).format('MMM Do YY');
        return (
          <NewsItem
            key={item.id}
            date={date}
            title={item.title}
            image={item.description}
            onPress={() => {
              if (item.news_link) {
                navigation.navigate('Web View', {
                  url: item.news_link,
                  type: 'news',
                });
              }
            }}
          />
        );
      });
    }
    return <Text style={styles.noNewsText}>No News.</Text>;
  };

  return (
    <View style={mStyles.page}>
      <View style={mStyles.content}>
        {!pinPosition ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={mStyles.container}
            contentContainerStyle={[mStyles.listContainer]}>
            <View style={styles.wrapperSection}>
              <Gap height={30} />
              <HomeProfile onPress={() => navigation.navigate('UserProfile')} />
              <WalletComponent navigation={navigation} />
              <Gap height={20} />
              <Text style={styles.welcome}>
                What kind of doctor do you want to consult today?
              </Text>
              <Gap height={16} />
            </View>
            <View style={styles.wrapperScroll}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.category}>
                  <Gap width={32} />
                  {doctorCategories.map((item, index) => {
                    return (
                      <DoctorCategory
                        key={index}
                        category={item}
                        onPress={() =>
                          navigation.navigate('ChooseDoctor', {data: item})
                        }
                      />
                    );
                  })}
                  <Gap width={22} />
                </View>
              </ScrollView>
            </View>
            <View style={styles.wrapperSection}>
              <TouchableOpacity
                disabled={!listHospitals}
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate('ListItemPages', {
                    type: 'hospital',
                    coordinate: pinPosition,
                  })
                }>
                <Image
                  source={HospitalBanner}
                  style={styles.bannerHospitalStyle}
                />
              </TouchableOpacity>
              <RecommendedDoctors />

              <Text style={styles.sectionLabel}>News for you</Text>
              {news ? (
                <NewsComponent />
              ) : (
                <Loading customStyles={styles.loadingStyles2} />
              )}
              <Gap height={10} />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const WalletComponent = ({navigation}) => {
  const [wallet, setWallet] = useState(0);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      console.log('data');
      getStorageItem('user_data')
        .then((res) => {
          getUser(res.user_id)
            .then((res) => {
              let walletAmount = res.wallet ? res.wallet : 0;
              console.log(walletAmount);
              setWallet(walletAmount);
            })
            .catch((err) => console.log(err.data));
        })
        .catch((err) => console.log(err.data));
    }
  }, [isFocus]);

  if (wallet === null) {
    return <View />;
  }
  // console.log(wallet);
  return (
    <View style={styles.walletWrapper}>
      <View style={mStyles.centerVerticalInline}>
        <Icon
          type="material-community"
          name="wallet"
          color={newColors.brightTurquiose}
        />
        <Text style={styles.myWalletText}>My Wallet</Text>
      </View>
      <View style={mStyles.centerVerticalInline}>
        <Text style={styles.walletValue}>
          {numberPrettier(wallet, 'pricing')}
        </Text>
        <Text style={styles.topup} onPress={() => navigation.navigate('TopUp')}>
          TopUp
        </Text>
      </View>
    </View>
  );
};

export default Doctor;

const styles = StyleSheet.create({
  wrapperSection: {
    paddingHorizontal: 16,
  },
  welcome: {
    ...fontStyles.title1,
    color: colors.text.primary,
  },
  category: {
    flexDirection: 'row',
  },
  wrapperScroll: {
    marginHorizontal: -16,
  },
  sectionLabel: {
    ...fontStyles.title1,
    color: newColors.carbonBlack,
    marginVertical: 10,
  },
  loadingStyles: {height: 66, marginTop: 30},
  loadingStyles2: {height: 50},
  noNewsText: {color: colors.text.menuInactive, flex: 1},
  bannerHospitalStyle: {
    width: screenWidth - 32,
    height: ((screenWidth - 32) * 111) / 328,
    marginBottom: 10,
    marginTop: 15,
  },
  recommendedDoctor: {
    ...fontStyles.title1,
    color: newColors.carbonBlack,
  },
  seeAllStyle: {
    ...fontStyles.body1,
    color: newColors.brightTurquiose,
    textDecorationLine: 'underline',
  },
  recDoctorLabelWrapper: {
    marginVertical: 10,
    ...mStyles.centerVerticalInline,
    justifyContent: 'space-between',
  },
  walletWrapper: {
    justifyContent: 'space-between',
    ...mStyles.centerVerticalInline,
    marginTop: 15,
  },
  myWalletText: {...fontStyles.heading, marginLeft: 5},
  walletValue: {
    ...fontStyles.heading,
    ...fontStyles.nunitoBold,
    color: newColors.carbonBlack,
  },
  topup: {
    ...fontStyles.heading,
    textDecorationLine: 'underline',
    color: newColors.brightTurquiose,
    marginLeft: 10,
  },
});
