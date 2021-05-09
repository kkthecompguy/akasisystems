const authUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return user;
    }
    return false;
  };
  
  export default authUser;