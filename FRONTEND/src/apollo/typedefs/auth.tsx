import gql from 'graphql-tag';

export const REGISTER = gql`
  mutation Register(
    $email: String!,
    $password: String!,
    $nickname: String,
    $avatar: Upload,
    $encodedVars: [String]
  ){
    register(
      email: $email,
      password: $password,
      nickname: $nickname,
      avatar: $avatar,
      encodedVars: $encodedVars,
    ){
      fail,
      message,
    }
  }
`
export const RESETPASSWORD = gql`
  mutation ResetPassword(
    $opassword: String!,
    $password: String!,
    $encodedVars: [String]
  ){
    resetPassword(
      opassword: $opassword,
      password: $password,
      encodedVars: $encodedVars,
    ){
      fail,
      message,
    }
  }
`
export const LOGIN = gql`
  mutation Login(
    $email: String!,
    $password: String!,
    $remember: Boolean,
    $encodedVars: [String]
  ){
    login(
      email: $email,
      password: $password,
      remember: $remember,
      encodedVars: $encodedVars,
    ){
      fail,
      message,
      authToken,
      refreshToken,
      key,
      avatar,
      nickname,
    }
  }
`

export const PUBKEY = gql`
  query Pubkey{
      pubkey
   }
`

export const ISAUTHENTICATED1 = gql`
  query IsAuthenticated1($permission: String){
      isAuthenticated1(permission: $permission){
        isAuth, needUpdate
      }
   }
`
export const ISAUTHENTICATED = gql`
  query IsAuthenticated{
      isAuthenticated{
        isAuth, needUpdate
      }
   }
`

export const UPDATETOKEN = gql`
  query UpdateToken($refreshToken: String!){
      updateToken(refreshToken: $refreshToken){
        updated, authToken, refreshToken,
      }
   }
`
