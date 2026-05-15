import axios from 'axios';

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post('/support/ticket', ticketData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create support ticket';
  }
};

export const getUserTickets = async () => {
  try {
    const response = await axios.get('/support/my-tickets');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tickets';
  }
};

export const getAllTickets = async () => {
  try {
    const response = await axios.get('/support/admin/all');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch admin tickets';
  }
};

export const getTicketDetails = async (id) => {
  try {
    const response = await axios.get(`/support/ticket/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch ticket details';
  }
};

export const replyToTicket = async (id, content) => {
  try {
    const response = await axios.post(`/support/reply/ticket/${id}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send reply';
  }
};

export const resolveTicket = async (id) => {
  try {
    const response = await axios.put(`/support/ticket/${id}/resolve`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to resolve ticket';
  }
};
