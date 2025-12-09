import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: false });

export async function signUp(payload) {
  return api.post('/auth/signup', payload).then(r => r.data);
}

export async function signIn(payload) {
  return api.post('/auth/signin', payload).then(r => r.data);
}
