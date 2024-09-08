import { graphql } from '@/gql';

graphql(`
  fragment MessageFragment on Message {
    _id
    content
    createdAt
    userId
  }
`);
