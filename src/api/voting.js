export const canVote = async (http, pollId) => {
  const { data: { data } } = await http.get(`/api/polls/${pollId}/can-vote`);
  return data;
};

export const statistic = async (http, pollId) => {
  const { data: { data } } = await http.get(`/api/polls/${pollId}/statistic`);
  return data;
};

export default {
  canVote,
  statistic,
};
