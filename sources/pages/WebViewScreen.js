import React, {useEffect, useState} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import HTML from 'react-native-render-html';
import {WebView} from 'react-native-webview';
import {Loading} from '../components';
import {getNewsDetail} from '../config/NewsRepo';
import {mStyles, newColors, screenWidth, SnackBar} from '../utils';
import fontStyles from '../utils/fonts';

const WebViewScreen = ({navigation, route}) => {
  let type = route.params.type ? route.params.type : 'topup';
  navigation.setOptions({
    headerTitle: type === 'news' ? 'News' : 'TopUp',
    headerLeft: () => null,
    headerRight: () => {
      return (
        <TouchableOpacity
          style={{marginHorizontal: 16}}
          onPress={() => navigation.goBack()}>
          <Icon name="close" type="material-community" />
        </TouchableOpacity>
      );
    },
  });

  if (type === 'news') {
    let newsUrl = route.params.url
      ? route.params.url
      : 'https://www.google.com';
    return <NewsContent newsUrl={newsUrl} navigation={navigation} />;
  }
  return (
    <>
      <WebView
        style={{backgroundColor: newColors.pureWhite, flex: 1}}
        source={{
          uri: route.params.url,
        }}
      />
    </>
  );
};

export default WebViewScreen;

const NewsContent = ({newsUrl, navigation}) => {
  const [newsData, setNewsData] = useState(null);
  console.log(newsUrl);

  useEffect(() => {
    getNewsDetail(newsUrl)
      .then((res) => {
        console.log('newsData', res);
        if (res.error) {
          SnackBar('Link not valid / problem occurred.', 'danger');
          return navigation.goBack();
        }
        setNewsData(res.data);
      })
      .catch((err) => console.log(err.data));
  }, [navigation, newsUrl]);

  return (
    <>
      {!newsData ? (
        <Loading />
      ) : (
        <ScrollView
          style={mStyles.container}
          contentContainerStyle={styles.scrollContainer}>
          <Text style={{...fontStyles.title1, paddingHorizontal: 16}}>
            {newsData.title}
          </Text>
          <HTML
            baseFontStyle={{
              ...fontStyles.nunitoRegular,
              color: newColors.carbonBlack,
            }}
            imagesMaxWidth={screenWidth - 32}
            containerStyle={{paddingHorizontal: 16}}
            html={newsData.content}
            onLinkPress={(event, href) => Linking.openURL(href)}
          />
          <Text style={styles.sourceText}>Source: {newsData.source}</Text>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    ...mStyles.listContainer,
    paddingVertical: 20,
  },
  headerText: {},
  sourceText: {
    color: newColors.blueZodiac,
    ...fontStyles.body1,
    paddingHorizontal: 16,
  },
});
