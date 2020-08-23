import { useState, useContext } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useCookies, Cookies } from 'react-cookie';
import { JSEncrypt } from 'jsencrypt';
import { ISAUTHENTICATED, UPDATETOKEN } from '../apollo/typedefs/auth';
import { ISSUPER } from '../apollo/typedefs/user';
import { store } from '../redux';
import apiclient  from '../apollo';

//auth token
const AUTHTOKEN = "authToken"
const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([AUTHTOKEN])
  const setAuthToken = (authToken: any) => setCookie(AUTHTOKEN, authToken)
  const removeAuthToken = () => removeCookie(AUTHTOKEN)
  return [cookies[AUTHTOKEN], setAuthToken, removeAuthToken]
}
export default useAuthToken

//refresh token
const REFRESHTOKEN = "refreshToken"
export const useRefreshToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([REFRESHTOKEN])
  const setRefreshToken = (refreshToken: any) => setCookie(REFRESHTOKEN, refreshToken)
  const removeRefreshToken = () => removeCookie(REFRESHTOKEN)
  return [cookies[REFRESHTOKEN], setRefreshToken, removeRefreshToken]
}

//islogin
const ISLOGIN = "isLogin"
export const useLogin = () => {
  const [cookies, setCookie, _] = useCookies([ISLOGIN])
  const setIsLogin = (iflogin:any) => setCookie(ISLOGIN, iflogin)
  return [setIsLogin]
}

export const IsLogin= () =>{
  const cookies = new Cookies();
  //const getAuthToken = (authToken: any) => cookies.set(AUTHTOKEN, authToken)
  const isLogin = cookies.get(ISLOGIN)
  return isLogin == 'true'
}

export const LoginNotify= () =>{
    apiclient().writeQuery({
      query:ISAUTHENTICATED,
      data:{'isAuthenticated':{'isAuth':true,'__typename':'AuthPayload','needUpdate':null}},
    });
}

export const LogoutNotify= () =>{
    apiclient().writeQuery({
      query:ISAUTHENTICATED,
      data:{'isAuthenticated':{'isAuth':false,'__typename':'AuthPayload','needUpdate':null}},
    });
}


export const LogSwitchAct = (action:any) =>{
  const { loading:authLoading, error:authError, data:Auth } = useQuery(ISAUTHENTICATED);
  const [act, setAct] = useState(true);
  const actions = () =>{
    action();
    setAct(false);
  }
  //action after login; set act false avoiding repeatly action
  (act && !authLoading && Auth && Auth.isAuthenticated.isAuth) ? actions(): null;
  //set reftech true after logout for next refetch
  (!act && Auth && (!Auth.isAuthenticated || !Auth.isAuthenticated.isAuth)) ? setAct(true): null;
}

export const getAuthToken = () =>{
  const cookies = new Cookies();
  //const getAuthToken = (authToken: any) => cookies.set(AUTHTOKEN, authToken)
  const AuthToken = cookies.get(AUTHTOKEN)
  return AuthToken
}


//public key
const PUBKEY = "pubKey"
export const usePubKey = () =>{
  const [cookies, setCookie, removeCookie] = useCookies([PUBKEY])
  const setPubKey = (pubKey: any) => setCookie(PUBKEY, pubKey)
  const removePubKey = () => removeCookie(PUBKEY)
  const updatePubKey = (pubKey: any) => {
    removeCookie(PUBKEY)
    setCookie(PUBKEY,pubKey)
  }
  return [cookies[PUBKEY], setPubKey, removePubKey, updatePubKey]
}


//encode and decode
const crypt = new JSEncrypt();

export const useCrypt = () =>{
  const encrypt = (key:string,content:any) =>{
    crypt.setKey(key);
    return crypt.encrypt(content,true)
  }

  const decrypt = (key:string,content:any) =>{
    crypt.setKey(key);
    return crypt.decrypt(content)
  }

  return [encrypt, decrypt]
}

export const encryptSet = (key:string, values:any, vars:string[]) =>{
  const [ encrypt ] = useCrypt();
  for (var val of vars){
    values[val] = encrypt(key, values[val])
  }
  return values
}


export const checkAuthenticated = (interval:any,setLoginSwitch:any) =>{

  const [_, setAuthToken,removeAuthToken] = useAuthToken()
  const [refreshToken, setRefreshToken, removeRefreshToken] = useRefreshToken()
  //const [setIsLogin] = useLogin();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  //change isAuth status
  //const [isAuthent, setIsAuth] = useState(false);
  //if the authoken is updated after checking refreshing
  //const [updatedToken, setUpdatedToken] = useState(false);

  //update the authtoken and refresh token
  const [updateToken, {data:updateData}] = useLazyQuery(UPDATETOKEN,{
    notifyOnNetworkStatusChange:true,
    fetchPolicy:'network-only',
    onCompleted(data){
      //console.log('++++++++++',data)
      const status = (data && data.updateToken && data.updateToken.updated) ? data.updateToken.updated: false
      //setIsLogin(status);
      if (!status){
        removeAuthToken()
        removeRefreshToken()
        //setIsLogin(false)
        //setLoginSwitch(false)
        dispatch({type:'login',payload:false});
      }
      //console.log('------------',data)
      //setUpdatedToken(status);
      if (data.updateToken && data.updateToken.authToken) {
        dispatch({type:'login',payload:true});
        setAuthToken(data.updateToken.authToken);
        //console.log('======',data.updateToken,status);
        //LoginNotify();
      }
      //if (data.updateToken && data.updateToken.refreshToken) setRefreshToken(data.updateToken.refreshToken);
    }
  })

  //check the authtoken
  const { data } = useQuery(ISAUTHENTICATED,{
    //pollInterval:1500,
    pollInterval:interval,
    notifyOnNetworkStatusChange:true,
    fetchPolicy:'network-only',
    onCompleted(data){
      //console.log(data,'==--==--')
      if (data && data.isAuthenticated.isAuth){
        dispatch({type:'login',payload:true});
        if (data.isAuthenticated.needUpdate){
          //console.log(data,'--------------')
          if (refreshToken) updateToken({variables:{"refreshToken":refreshToken}});
        }
      }else{
        //console.log(data,'++++++++++++')
        if (refreshToken) updateToken({variables:{"refreshToken":refreshToken}});
      }
    }
  });
  //return (data && data.isAuthenticated) ? data.isAuthenticated: false ;
  //console.log(isAuthent,updatedToken,'777777777777777')
  //console.log(IsLogin(),'=============')
  //return IsLogin() && (isAuthent || updatedToken);
}

export const isSuper = () =>{

  const { loading:issuperLoading, error:issuperError, data:isSuper, refetch:refSuper } = useQuery(ISSUPER,{
    fetchPolicy:'network-only',
    notifyOnNetworkStatusChange:true,
  });

  //update super after login/out
  LogSwitchAct(refSuper);

  const issuper = !issuperLoading && isSuper && isSuper.isSuper && isSuper.isSuper.isSuper
  return [issuper]
}
