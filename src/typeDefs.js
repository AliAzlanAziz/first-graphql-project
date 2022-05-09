const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type Query {
    user: User,
    posts(limit: Int, skip: Int): [Post!]!,
    post(id: ID!): Post,
    userPosts(id: ID!): [Post!]!,
    myPosts: [Post!]!,
  },
  type Mutation{
    signup(name: String!, email: String!, password: String!): Boolean!,
    signin(email: String!, password: String!): String,
    addPost(title: String, description: String!, privacy: String): Post,
  },
  type Subscription{
    newUser: User!
  }
  type User{
    id: ID,
    name: String,
    email: String
  }
  type Post{
    id: ID,
    user: User,
    title: String,
    description: String,
    privacy: String
  }
`;