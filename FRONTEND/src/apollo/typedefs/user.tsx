import gql from 'graphql-tag';


export const USERPROFILE = gql`
  query UserProfile{
      userProfile{
        email,
        avatar,
        nickname,
        message,
      }
   }
`;

export const ISSUPER = gql`
  query IsSuper{
      isSuper{
        isSuper, message
      }
   }
`;

export const UPDATESETTING = gql`
  mutation UpdateSetting(
    $nickname: String,
    $avatar: Upload,
  ){
    updateSetting(
      nickname: $nickname,
      avatar: $avatar,
    ){
      fail,
      message,
    }
  }
`
