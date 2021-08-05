const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.find({
                    where: {
                        _id: context.user._id,
                    },
                });
            }

            throw new AuthenticationError('No user found');
        },
    },
    Mutation: {
        login: async (parent, { email, password }, context) => {
            const user = await User.find({
                where: {
                    email,
                },
            });

            if (!user) {
                throw new AuthenticationError('No user found with that email');
            }

            const validPassword = user.isCorrectPassword(password);
            if (!validPassword) {
                throw new AuthenticationError('Incorrect password');
            }

            token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            token = signToken({
                username,
                email,
                password,
            });

            return { token, user };
        },

        saveBook: async (parent, { bookInput }, context) => {
            if (context.user) {
                const user = User.findOneAndUpdate(
                    {
                        where: {
                            _id: context.user._id,
                        },
                    },
                    {
                        $push: {
                            savedBooks: bookInput,
                        },
                    },
                    {
                        new: true,
                    }
                );
                return user;
            }
            throw new AuthenticationError('No user found');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = User.findOneAndUpdate(
                    {
                        where: {
                            _id: context.user._id,
                        },
                    },
                    {
                        $pull: {
                            savedBooks: { bookId },
                        },
                    },
                    {
                        new: true,
                    }
                );
                return user;
            }
            throw new AuthenticationError('No user found');
        },
    },
};

module.exports = resolvers;
