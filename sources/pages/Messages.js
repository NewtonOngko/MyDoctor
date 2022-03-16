import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {List, Loading} from '../components/molecules';
import FBase from '../config/FBase';
import {colors, fonts, getStorageItem, parseToArray} from '../utils';

const Messages = ({navigation}) => {
  const [messages, setMessages] = useState(null);
  const [myUID, setMyUID] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isFocus = useIsFocused();

  const handleGetMe = () => {
    getStorageItem('userData')
      .then((res) => setMyUID(res.uid))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setIsLoading(true);
    handleGetMe();

    let db = FBase.database().ref();
    let urlPath = `messages/${myUID}/`;
    let messageDB = db.child(urlPath);
    messageDB.on('value', async (snapshot) => {
      if (snapshot.val()) {
        let data = snapshot.val();
        let array = [];
        let promiseObj = await Object.keys(data).map(async (key) => {
          const doctorRootData = `doctors/${data[key].uidPartner}`;
          const doctorData = await db.child(doctorRootData).once('value');

          array.push({
            id: key,
            ...data[key],
            detailDoctor: doctorData.val(),
          });
        });

        await Promise.all(promiseObj);
        setMessages(array);
        return setIsLoading(false);
      }
      setIsLoading(false);
      return setMessages([]);
    });
  }, [myUID, isFocus]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.page}>
        <View style={styles.content}>
          <Text style={styles.title}>Messages</Text>
          {!messages || isLoading ? (
            <Loading customStyles={{height: 0}} />
          ) : messages.length > 0 ? (
            messages.map((message, index) => {
              if (message.detailDoctor) {
                return (
                  <List
                    key={message.id}
                    profile={{uri: message.detailDoctor.photo}}
                    name={message.detailDoctor.fullName}
                    desc={message.lastContent}
                    onPress={() =>
                      navigation.navigate('Chat', {data: message.detailDoctor})
                    }
                  />
                );
              }
            })
          ) : (
            <View style={styles.noMessage}>
              <Text>No Messages to show</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContainer: {flexGrow: 1},
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginLeft: 16,
  },
  noMessage: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
});
