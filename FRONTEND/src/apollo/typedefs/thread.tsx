import gql from 'graphql-tag';


export const THREADS = gql`
  query Threads(
    $forumName: String!,
  ){
      threads(
        forumName: $forumName,
        ){
          id, title, content, creator, created_at,
          last_activity, nickname, avatar, replies,
          last_user, last_avatar, last_reply_at, last_reply_id,, nView
      }
   }
`;


export const THREADACT = gql`
  mutation ForumAct(
    $forumName: String,
    $threadId: Int,
    $title: String,
    $content: String,
    $action: String!,
   ){
      threadAct(
        forumName: $forumName,
        threadId: $threadId,
        action: $action,
        title: $title,
        content: $content,
      ){
        fail, message
      }
   }
`;

export const THREAD = gql`
  query Thread(
    $threadId: Int!,
    $currentPage: Int,
    $pageSize: Int,
  ){
      thread(
        threadId: $threadId, currentPage: $currentPage, pageSize: $pageSize,
        ){
          id, title, content, creator, created_at, avatar, replies, forumName, nPost
          posts{
            id, content, creator, created_at, avatar,
          }
      }
   }
`;
