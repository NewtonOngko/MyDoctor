import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {BottomNavigator} from './components';
import {
  Activity,
  ChangePassword,
  Chat,
  ChooseDoctor,
  Doctor,
  DoctorProfile,
  GetStarted,
  HospitalDetail,
  ListItemPages,
  Login,
  NewCheckout,
  OrderDoctor,
  Register,
  SplashScreen,
  TopUp,
  UpdateProfile,
  UploadPhoto,
  UserProfile,
} from './pages';
import WebViewScreen from './pages/WebViewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomNavigator {...props} />}>
      <Tab.Screen name="Dashboard" component={Doctor} />
      <Tab.Screen name="Activity" component={Activity} />
      {/* <Tab.Screen name="Medicine" component={PurchasedMedicine} /> */}
      {/* <Tab.Screen name="Doctor" component={Doctor} /> */}
      {/* <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Hospitals" component={Hospitals} />
      <Tab.Screen name="Order" component={PurchasedMedicine} /> */}
      <Tab.Screen name="Account" component={UserProfile} />
    </Tab.Navigator>
  );
};

const Router = () => {
  const routeMenu = [
    {name: 'SplashScreen', component: SplashScreen},
    {name: 'GetStarted', component: GetStarted},
    {name: 'Login', component: Login},
    {name: 'Register', component: Register},
    {name: 'UploadPhoto', component: UploadPhoto},
    {name: 'MainApp', component: MainApp},
    {name: 'ChooseDoctor', component: ChooseDoctor},
    {name: 'Chat', component: Chat},
    {name: 'UserProfile', component: UserProfile},
    {name: 'UpdateProfile', component: UpdateProfile},
    {name: 'ChangePassword', component: ChangePassword},
    {name: 'DoctorProfile', component: DoctorProfile},
    {name: 'Checkout', component: NewCheckout},
    {name: 'ListItemPages', component: ListItemPages},
    {name: 'HospitalDetail', component: HospitalDetail},
    {name: 'OrderDoctor', component: OrderDoctor},
    {name: 'TopUp', component: TopUp},
    {name: 'Web View', component: WebViewScreen},
  ];

  return (
    <Stack.Navigator initialRouteName="Splash">
      {routeMenu.map((item, index) => {
        let shownHeader = item.name === 'Web View' ? true : false;
        return (
          <Stack.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{headerShown: shownHeader}}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default Router;
