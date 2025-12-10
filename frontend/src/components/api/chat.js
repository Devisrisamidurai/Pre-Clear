import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: false });

export async function sendMessage(shipmentId, message, senderId = null) {
  return api.post(`/chat/shipments/${shipmentId}/messages`, { message, senderId }).then(r => r.data);
}
