import React, { useReducer, useContext, createContext } from 'react';

const UserContex = createContext();

const initialData = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'AUTH_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', payload.token);
      return {
        isLogin: true,
        user: payload,
      };
    case 'USER_PROFILE':
      return {
        isLogin: true,
        user: payload,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        isLogin: false,
        user: {},
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialData);
  return <UserContex.Provider value={[state, dispatch]}>{children}</UserContex.Provider>;
};

export const useUserContext = () => {
  return useContext(UserContex);
};
