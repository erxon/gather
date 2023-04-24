import nextConnect from "next-connect";
import crypto from 'crypto';
import { updateUserByUsername } from "@/lib/db";

const handler = nextConnect();

handler.post((req, res) => {
    const {
        username,
        newPassword,
        curPassword,
        curSalt,
        curHash
    } = req.body
    if (newPassword === "" || curPassword === ""){
        res.json({type: 'error', message: 'empty field'})
    } else {
        const reHash = crypto
        .pbkdf2Sync(curPassword, curSalt, 1000, 64, 'sha512')
        .toString('hex')
    
        if(curHash === reHash){
            const newPasswordSalt = crypto.randomBytes(16).toString('hex')
            const newPasswordHash = crypto
                .pbkdf2Sync(newPassword, newPasswordSalt, 1000, 64, 'sha512')
                .toString('hex')
    
            updateUserByUsername(req, username, {salt: newPasswordSalt, hash: newPasswordHash})
            .then((data) => {
                if(data && data.errors){
                    res.status(400).json({error: 'Something went wrong'});
                }
                res.status(200).json({message: 'Password changed'});
            })
    
        } else {
            res.status(400).json({error: 'invalid password'})
        }
    }

    
})

export default handler;