import jwt from 'jsonwebtoken'
import User from '../models/user'

exports.getUser = async (token) => {
    try{
        if(token == '' || token === null){
            return null;
        }

        const { id } = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(id)
        if(!user) return null

        return user
    }catch(error){
        // console.log(JSON.stringify(error))
        console.log(error.message)
        return null
    }
}