import gql from 'graphql-tag';


/*
export const THREADS = gql`
  query Threads(
    $forumName: String!,
  ){
      threads(
        forumName: $forumName,
        ){
          id, title, content, creator, created_at,
          last_activity, nickname, avatar, replies,
          last_user, last_avatar, last_reply_at,
      }
   }
`;
*/

export const POSTACT = gql`
  mutation PostAct(
    $threadId: Int!,
    $content: String,
    $action: String!,
   ){
      postAct(
        threadId: $threadId,
        action: $action,
        content: $content,
      ){
        fail, message
      }
   }
`;

/*
export const THREAD = gql`
  query Thread(
    $threadId: Int!,
  ){
      thread(
        threadId: $threadId,
        ){
          id, title, content, creator, created_at, avatar, replies,
          posts{
            id, content, creator, created_at, avatar,
          }
      }
   }
`;
*/
