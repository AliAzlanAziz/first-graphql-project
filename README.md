# first-graphql-project
First hands on GraphQL

**A simple GraphQL Project where a user can;**
- sign up
- sign in
- post Post
- view his/her all posts
- view his/her particular posts both private and public privacy type
- view all public posts 
- view other's all public posts
- view other's particular post but only public
- view his/her information

_To run the project;_ 
- clone the repo
- run npm install in the root directory of the cloned directory(where package.json is)
- Make a config.env file inside src/config/ 
- place the following values inside config.env
>>PORT=<port><br />
>>MONGO_URI=<mongouri><br />
>>SECRET_KEY=<secretkey><br />
>>NODE_ENV=<node_environment><br />
- then in the root directory of the clone directory(where app.js is) run npm run babel-node
