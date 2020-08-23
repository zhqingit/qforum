import React, {useState, setInterval, useContext, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import GuestNav from './GuestNav';
import UserNav from './UserNav';
import { store } from '../../redux';
import { ISSUPER } from '../../apollo/typedefs/user';
import { checkAuthenticated, IsLogin } from '../../auth';



const UserMenu = () =>{
  const [loginSwitch, setLoginSwitch] = useState(false)
  const [oneCheckSuper, setoneCheckSuper] = useState(0)

  const globalState = useContext(store);
  const { dispatch } = globalState;
  const isAuth = globalState.state.isAuth;
  const preisAuth = globalState.state.preisAuth;
  var test = isAuth;

  const { loading:issuperLoading, error:issuperError, data:isSuper, refetch:refSuper } = useQuery(ISSUPER,{
  //const [checkSuper, {loading:issuperLoading, error:issuperError, data:isSuper, refetch:refSuper }] = useLazyQuery(ISSUPER,{
    fetchPolicy:'network-only',
    notifyOnNetworkStatusChange:true,
    onCompleted(data){
      //console.log(globalState,'----------+++++++++++');
      if (data && data.isSuper.isSuper){
        dispatch({type:'isSuper',payload:true})
        //console.log(globalState,'+++++++++++',globalState.state.isSuper);
      }
    },
  });


  if (preisAuth!=isAuth){
    if (isAuth){
      refSuper();
    }
    dispatch({type:'preLogin',payload:isAuth})
  }
  //console.log(globalState,'--------',oneCheckSuper);
  checkAuthenticated(100000,setLoginSwitch);
  return(
    //IsLogin()?
    isAuth?
    <UserNav setLoginSwitch={setLoginSwitch}/>:
    <GuestNav  setLoginSwitch={setLoginSwitch}/>
  )
}

export default UserMenu;
