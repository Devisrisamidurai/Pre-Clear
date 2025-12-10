import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: false });

export async function askBot(message) {
  return api.post('/chatbot/ask', { message }).then(r => r.data);
}
