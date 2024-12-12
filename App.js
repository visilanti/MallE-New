import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/Portal/Splash/SplashScreen';
import Splash1 from './src/screens/Portal/Splash/Splash1';
import Splash2 from './src/screens/Portal/Splash/Splash2';
import Splash3 from './src/screens/Portal/Splash/Splash3';
import SignIn from './src/screens/Portal/SignIn';
import SignUp from './src/screens/Portal/SignUp';
import ForgotPassword from './src/screens/Portal/ForgotPassword';
import ProfileDetails from './src/screens/ProfileDetails/ProfileDetails';
import SettingUser from './src/screens/SettingUser';
import DetailProduk from './src/screens/DetailPage/DetailProduk';
import Payment from './src/screens/Payment';
import Home from './src/screens/Home';
import AddCollection from './src/screens/AddCollection';
import MyStore from './src/screens/MyStore';
import OrderDetail from './src/screens/OrderDetails/OrderDetails';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Splash1" component={Splash1} />
        <Stack.Screen name="Splash2" component={Splash2} />
        <Stack.Screen name="Splash3" component={Splash3} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen
          name="ProfileDetails"
          component={ProfileDetails}
        />
        <Stack.Screen name="SettingUser" component={SettingUser} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={DetailProduk} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="AddCollection" component={AddCollection} />
        <Stack.Screen name="MyStore" component={MyStore} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
