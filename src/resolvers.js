import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions';
import User from './models/user'
import Post from './models/post'
const saltRounds = 10

const pubSub = new PubSub();

const NEW_USER = "NEW_USER";

export const resolvers = {
    Query: {
        user: async (_, __, context) => {
            try{
                if(!context.user) return null
                return await User.findById(context.user._id).select('_id name email')
            }catch(error){
                return null
            }
        },
        posts: async (_, { limit, skip }, context) => {
            try{
                if(!context.user) return null
                return await Post
                    .find({ privacy: 'public' })
                    .populate('user', '_id name')
                    .limit(limit)
                    .skip(skip)
            }catch(error){
                return []
            }
        },
        post: async (_, { id }, context) => {
            try{
                if(!context.user) return null
                const post = await Post.findById(id).populate('user', '_id name')
                if(post.privacy === 'public')
                    return post
                else
                    if(post.user._id.toString() === context.user._id.toString())
                        return post
                    else
                        return null
            }catch(error){
                return null
            }
        },
        userPosts: async (_, { id }, context) => {
            try{
                if(!context.user) return null
                return await Post.find({ user: id, privacy: 'public' }).populate('user', '_id name')
            }catch(error){
                return []
            }
        },
        myPosts: async (_, __, context) => {
            try{
                if(!context.user) return null
                return await Post.find({ user: context.user._id }).populate('user', '_id name email')
            }catch(error){
                return []
            }
        },
    },
    Mutation: {
        signup: async (_, { name, email, password }, __) => {
            try{
                const userExist = await User.find({ email })
                if(userExist[0]) return false

                const hash = bcrypt.hashSync(password, saltRounds)

                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: hash,
                }); 

                await user.save()
                pubSub.publish(NEW_USER, {
                    newUser: user
                });
                return true
            }catch(error){
                console.log(error)
                return false
            }
        },
        signin: async (_, { email, password }, __) => {
            try{
                const user = await User.find({ email })
                if(!user[0]) return "User does not exist!"

                const hash = bcrypt.compareSync(password, user[0].password)
                if(hash){
                    const token = jwt.sign({ id: user[0]._id }, process.env.SECRET_KEY, { expiresIn: '12h' })
                    return token
                }else{
                    return "Incorrect Credentials!"
                }
            }catch(error){
                console.log(error)
                return "Error signing in!"
            }
        },
        addPost: async (_, { title, description, privacy }, context) => {
            try{
                if(!context.user) return null
                const post = new Post({
                    _id: new mongoose.Types.ObjectId(),
                    user: context.user._id,
                    title: title,
                    description: description,
                    privacy: privacy,
                }); 

                const result = await post.save()
                return result
            }catch(error){
                console.log(error)
                return null
            }
        }
    },
    Subscription: {
        newUser: {
            subscribe: (_, __, ___) => pubSub.asyncIterator(NEW_USER)
        }
    },
};