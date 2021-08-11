const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({
                    _id: context.user._id,
                });
                return user;
            }

            throw new AuthenticationError('No user found');
        },
    },

    Mutation: {
        login: async (parent, { email, password }, context) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with that email');
            }

            const validPassword = await user.isCorrectPassword(password);
            if (!validPassword) {
                throw new AuthenticationError('Incorrect password');
            }

            token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken({
                username,
                email,
                _id: user._id,
            });

            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $addToSet: {
                            savedBooks: args,
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
                        _id: context.user._id,
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
