export const authAzure = async (http, accessToken) => {
  const { data: { token } } = await http({
    url: `${process.env.VUE_APP_API_URL}/auth/azure`,
    method: 'post',
    data: { accessToken },
  });

  return token;
};

export const authInvitation = async (http, invitation) => {
  const { data: { token } } = await http({
    url: `${process.env.VUE_APP_API_URL}/auth/invitation`,
    method: 'post',
    data: { token: invitation },
  });

  return token;
};

export const me = async (http) => {
  const { data: { data } } = await http.post(`${process.env.VUE_APP_API_URL}/auth/me`);
  return data;
};

export default {
  authAzure,
  authInvitation,
  me,
};
