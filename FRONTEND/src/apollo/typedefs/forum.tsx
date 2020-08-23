import gql from 'graphql-tag';



export const SECTIONS = gql`
  query Sections{
      sections{
          id, name, description, slug, status,
          forums{
            id,name, description, slug, status,nThread, nPost, thread, thread_id,thread_last_activity,last_user, last_avatar, last_post_id
          }
      }
   }
`;

export const SECTIONACT = gql`
  mutation SectionAct(
    $id: Int,
    $name: String,
    $description: String,
    $action: String!,
   ){
      sectionAct(
        id: $id,
        action: $action,
        name: $name,
        description: $description,
      ){
        fail, message
      }
   }
`;

export const FORUMACT = gql`
  mutation ForumAct(
    $id: Int,
    $sectionId: Int,
    $name: String,
    $description: String,
    $action: String!,
   ){
      forumAct(
        id: $id,
        sectionId: $sectionId,
        action: $action,
        name: $name,
        description: $description,
      ){
        fail, message
      }
   }
`;
