import axios from 'axios';

export const submitProposal = async (proposalData) => {
  try {
    const response = await axios.post('/proposal/submit', proposalData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit proposal';
  }
};

export const getMyProposals = async () => {
  try {
    const response = await axios.get('/proposal/my-proposals');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch proposals';
  }
};

export const getClientProposals = async () => {
  try {
    const response = await axios.get('/proposal/client-proposals');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch project proposals';
  }
};

export const acceptProposal = async (proposalId) => {
  const response = await axios.post(`/proposal/accept/${proposalId}`);
  return response.data;
};
