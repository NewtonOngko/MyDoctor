import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {ChatItem, Header, InputChat} from '../components';
import FBase from '../config/FBase';
import {
  colors,
  combineDate,
  fonts,
  parseToArray,
  SnackBar,
  timeStamp,
} from '../utils';

const Chat = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [chatContents, setChatContents] = useState([]);
  let data = route.params.data;
  let user = route.params.user;
  let myUserId = `user-${user.user_id}`;
  let doctorData = data.doctor;
  let doctorPhoto = data.doctor.profile_picture;
  let doctorId = `doctor-${doctorData.doctor_id}`;
  let path = `chatting/${myUserId}_${doctorId}/`;
  let orderId = data.transaction_id;

  let endScheduleTime = route.params.endScheduleTime;
  // console.log(route.params);

  useEffect(() => {
    FBase.database()
      .ref(`${path}/allChat/${orderId}/`)
      .on('value', (res) => {
        console.log(res.val());
        if (res.val()) {
          let _data = parseToArray(res.val());
          let data2 = parseToArray(_data[0].data);
          return setChatContents(data2);
        }
        return setChatContents([]);
      });
  }, []);

  const sendChat = () => {
    let differenceTime = endScheduleTime - new Date().getTime();
    if (differenceTime < 2000) {
      SnackBar('Consultation time up', 'danger');
      return navigation.goBack();
    }

    const chat = {
      sendBy: myUserId,
      chatDate: timeStamp,
      chatTime: moment().format('HH:mm'),
      chatMessage: text.trim(),
    };
    let chatID = `${myUserId}_${doctorId}`;
    let chatPath = `${path}/allChat/${orderId}/${combineDate}`;
    console.log(chat);
    Keyboard.dismiss();
    FBase.database()
      .ref(chatPath)
      .push(chat)
      .then(() => {
        handleSetMessages(chatID);
      })
      .catch((err) => console.log(err));
  };
  const handleSetMessages = (chatID) => {
    let messageUserPath = `messages/${myUserId}/${chatID}`;
    let messageDoctorPath = `messages/${doctorId}/${chatID}`;
    let dataHistoryChatUser = {
      lastContent: text.trim(),
      lastChatDate: timeStamp,
      uidPartner: doctorData,
    };
    let dataHistoryChatDoctor = {
      lastContent: text.trim(),
      lastChatDate: timeStamp,
      uidPartner: myUserId,
    };
    FBase.database().ref(messageUserPath).set(dataHistoryChatUser);
    FBase.database().ref(messageDoctorPath).set(dataHistoryChatDoctor);
    setText('');
  };

  return (
    <View style={styles.page}>
      <Header
        title={doctorData.full_name}
        category={doctorData.specialist}
        photo={doctorPhoto && {uri: doctorPhoto}}
        type="dark-profile"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {chatContents.length < 1 ? (
            <View />
          ) : (
            <>
              {chatContents.map((chat, index) => {
                let chatData = chat;
                let chatItem = chatData.data;
                let isMe = myUserId === chatItem.sendBy;
                let chatDate = moment(chatItem.chatDate).format('HH:mm');
                return (
                  <View key={index}>
                    {/* <Text style={styles.chatDate}>{chatDate}</Text> */}

                    <ChatItem
                      key={chatItem.id}
                      isMe={isMe}
                      message={chatItem.chatMessage}
                      time={chatDate}
                      photo={{uri: doctorData.photo}}
                    />
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
      <InputChat
        value={text}
        disabled={!text}
        onChangeText={(value) => setText(value)}
        onButtonPress={sendChat}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  scrollContainer: {flexGrow: 1},
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
