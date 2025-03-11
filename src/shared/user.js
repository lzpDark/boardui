export const getUserInformation = ()=> localStorage.getItem('userInfo');

export const setUserInformation = (userInfo)=> localStorage.setItem('userInfo', userInfo);

export const removeUserInformation = ()=> localStorage.removeItem('userInfo');