import axios from 'axios';
import { makeUseAxios } from 'axios-hooks';
import { AsyncStorage } from 'react-native';
import Axios from 'axios';

const API_URL = 'http://192.168.10.7:5000/v2/mobile';

export const UPLOADS_API_URL = 'http://192.168.10.7:5000/';

export const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: API_URL }),
});

export const useAuthedAxios = () => {
  let token;

  const getToken = async () => {
    const authString = await AsyncStorage.getItem('auth');

    const auth = authString ? JSON.parse(authString) : null;

    const token = auth ? auth.token : null;

    return token;
  };

  getToken();

  console.log('Token:', token);

  return makeUseAxios({
    axios: axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });
};

export const updateRideRoute = async (driverID, updatedRoute) => {
  await Axios.post(`${API_URL}/driver/ride/track`, {
    driverID,
    updatedRoute,
  });
};

export const RemoveNotificationToken = async (memberID, token) => {
  await Axios.post(`${API_URL}/member/notification/remove`, {
    memberID,
    token,
  });
};
