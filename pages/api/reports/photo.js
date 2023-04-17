import nextConnect from "next-connect";
import formidable from "formidable";

const handler = nextConnect();

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async (req, res) => {
  const form = formidable({multiples: true, uploadDir: `${__dirname}/../uploads`})

  form.parse(req, (err, fields, files) => {
    console.log('fields: ', fields);
    console.log('files: ', files)
    console.log(err)
  })
  // form.parse(req);
  
  // form.on('fileBegin', function(name, file) {
  //   file.path = __dirname + '/uploads/' + file.name
  // });

  // form.on('file', function (name, file) {
  //   console.log('Uploaded file' + file.name)
  // });

});

export default handler;
