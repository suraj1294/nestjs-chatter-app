import { graphql } from '@/gql';

graphql(`
  fragment ChatFragment on Chat {
    _id
    name
    isPrivate
    userIds
  }
`);
