import nextConnect from 'next-connect';
import formidable from 'formidable'
import fs from 'fs'
import { updateUserByUsername } from '@/lib/db';

const handler = nextConnect();

handler.put( async (req, res) => {
    const photo = {
        data: {},
        contentType: ""
    }
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
        if (err){
            
            return res.status(400).json({error: 'Photo could not be uploaded'})
        }
        if(files.photo){
            photo.data = fs.readFileSync(files.photo.path)
            photo.contentType = files.photo.type
        }
        updateUserByUsername({username: fields.username}, photo).then((data) => {
            return res.json(data)
        })
    })
})

export default handler;