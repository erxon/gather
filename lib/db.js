import crypto from 'crypto'
import dbConnect from '@/db/dbConnect';
import User from '@/db/user';

export function getAllUsers() {
  // For demo purpose only. You are not likely to have to return all users.
  const users = dbConnect().then(async () => {
    const data = await User.find();
    return data;
  });
  return users;
}

export function createUser(req, { username, password, email, type }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  const user = {
    createdAt: Date.now(),
    username,
    email,
    hash,
    type,
    salt,
    firstName: '',
    lastName: '',
    contactNumber: '',
    socialMediaAccounts: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    contacts: [],
  }

  const saveUser = dbConnect().then(async () => {
    const newUser = new User(user); 
    const data = await newUser.save()
    return data;
  })
  return saveUser;
}

export function findUserByUsername(req, username) {
  // Here you find the user based on id/username in the database
  // const user = await db.findUserById(id)
  // return req.session.users.find((user) => user.username === username)
  
  const user = dbConnect().then(async () => {
    const data = await User.findOne({username: username});
    return data;
  });
  return user;
}

export function findUserById(id) {
  const user = dbConnect().then(async () => {
    const data = await User.findById(id).populate('contacts').exec();
    
    return data;
  });
  return user;
}

export function updateUserByUsername(req, username, update) {
  // Here you update the user based on id/username in the database
  // const user = await db.updateUserById(id, update)
  // const user = req.session.users.find((u) => u.username === username)
  // Object.assign(user, update)
  // return user
  const userUpdate = dbConnect().then(async () => {
    const user = await User.findOneAndUpdate({username: username}, update)
    return user;
  })
  return userUpdate;
}

export function deleteUser(req, username) {
  // Here you should delete the user in the database
  // await db.deleteUser(req.user)
  const user = req.user;
  const deleteUser = user.then(async (data) => {
    return dbConnect().then(async () => {
      const user = await User.findOneAndDelete({username: data.username})
      return user;
    });
  })
  
  return deleteUser;
}

// Compare the password of an already fetched user (using `findUserByUsername`) and compare the
// password for a potential match
export function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  const passwordsMatch = user.hash === inputHash
  return passwordsMatch
}