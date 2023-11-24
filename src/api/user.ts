import { http } from './http';

const REDIRECT_URI = 'https://sweetme.vercel.app/oauth/kakao/callback';
const CLIENT_ID = `${process.env.REACT_APP_KAKAO_REST_API_KEY}`;

export const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

export const sendCode = async (code: string) => {
  try {
    const res = await http.post('/kakao/login', {
      code: code,
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getUserInfo = async () => {
  try {
    const res = await http.get('/members');
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const logout = async () => {
  try {
    const res = await http.post('/kakao/logout');
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const patchNickname = async (nickname: string) => {
  try {
    const res = await http.patch('/members', {
      nickname: nickname,
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const unlinkUser = async () => {
  try {
    const res = await http.delete('/kakao/unlink');
    return res;
  } catch (err) {
    console.log(err);
  }
};
