import authUser from './authUser';

const authHeader = () => {
  const user = authUser();

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export default authHeader;