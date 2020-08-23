import React, { createContext, useReducer } from 'react';
import { getLocale } from 'umi';

const initialState = {
      'isAuth':false,
      'preisAuth':false,
      'isSuper':false,
      'showLoginModal':false,
      'locale':getLocale(),
    };
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) =>{
  const [state, dispatch] = useReducer((state, action) =>{
    switch(action.type){
      case 'login':{
        const newState = {...state,'isAuth':action.payload}
        return newState;
      }
      case 'preLogin':{
        const newState = {...state,'preisAuth':action.payload}
        return newState;
      }
      case 'showLoginModal':{
        const newState = {...state,'showLoginModal':action.payload}
        return newState;
      }
      case 'isSuper':{
        const newState = {...state,'isSuper':action.payload}
        return newState;
      }
      case 'LOCALE':{
        const newState = {...state,'locale':action.payload}
        return newState;
      }
      default:
        throw new Error();
    };
  },initialState);
  return <Provider value={{state, dispatch}}>{children}</Provider>
};

export {store, StateProvider}
