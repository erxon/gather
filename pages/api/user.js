import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import { deleteUser, createUser, updateUserByUsername } from '../../lib/db'

const handler = nextConnect()

handler
  .use(auth)
  .get((req, res) => {
    // You do not generally want to return the whole user object
    // because it may contain sensitive field such as !!password!! Only return what needed
    // const { name, username, favoriteColor } = req.user
    // res.json({ user: { name, username, favoriteColor } })
    if (req.user) {
      const user = req.user;
      user.then((data) => {
        res.json({user: data})
      })
    }
    
  })
  .post((req, res) => {
    const { username, password, name } = req.body
    createUser(req, { username, password, name })
    res.status(200).json({ success: true, message: 'created new user' })
  })
  .use((req, res, next) => {
    // handlers after this (PUT, DELETE) all require an authenticated user
    // This middleware to check if user is authenticated before continuing
    const user = req.user;
    user.then((data) => {
      if (!data) {
        res.status(401).send('unauthenticated')
      } else {
        next()
      }
    });
    
  })
  .put((req, res) => {
    const user = req.user;
    const update = req.body
    user.then((user) => {
      updateUserByUsername(req, user.username, update).then((data) => {
        if (data && data.errors){
          res.json({message: 'Something went wrong'})
        }
        res.json({data, message: "Successfully updated"})
      })
    })
    
  })
  .delete((req, res) => {
    deleteUser(req).then(() => {
      req.logOut()
      res.status(204).end()
    });
  })

export default handler