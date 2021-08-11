const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        link: String
        image: String
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookId: String!, authors: [String], description: String!, title: String!, link: String, image: String): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;
