//Require module
const express = require('express');
const Tesseract = require('tesseract.js');
const path = require('path');
const fileUpload = require('express-fileupload');

// Express Initialize
const app = express();
const port = 8000;

// default options
app.use(fileUpload());

app.listen(port, () => {
  console.log('listen port 8000');
})

app.get('/test', (req, res) => {
  Tesseract.recognize(
    path.join(__dirname, 'images', 'test.png'),
    'tha',
    { }
  ).then(({ data }) => {
    let resTest = '';
    for (let i = 0; i < data.text.length; i++) {
      if (data.text[i] != ' ') {
        resTest = resTest + data.text[i];
      }
    }
    const response = data.text.replace(' ', '');
    console.log('resTest', resTest)
    console.log('data.text', data.text)
    console.log('response', response)
    // console.log(data);
    res.json({ data: data.text });
  })

})

app.post('/upload', async function (req, res) {
  let result = {
    name: '',
    address: '',
  };

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // console.log(req.files.address);
  const imgNameFile = req.files.name;
  const imgAddressFile = req.files.address;

  // const nameFilePath = __dirname + '/uploads/' + imgNameFile.name;
  // const addressFilePath = __dirname + '/uploads/' + imgAddressFile.name;

  const dateNow = new Date().getMilliseconds();
  const nameFilePath = __dirname + '/uploads/' + `${dateNow}_name.png`;
  const addressFilePath = __dirname + '/uploads/' + `${dateNow}_address.png`;

  const saveFileName = imgNameFile.mv(nameFilePath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  const saveFileAddress = imgAddressFile.mv(addressFilePath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  // const ocrNameTTT = await Tesseract.recognize(path.join(nameFilePath), 'tha',
  //   { logger: m => console.log(m) }
  // );
  // const ocrAddressTTT = await Tesseract.recognize(path.join(addressFilePath), 'tha',
  //   { logger: m => console.log(m) }
  // );
  await Promise.all([saveFileName, saveFileAddress]);

  const ocrName = Tesseract.recognize(path.join(nameFilePath), 'tha',
    { logger: m => console.log(m) }
  );


  const ocrAddress = Tesseract.recognize(path.join(addressFilePath), 'tha',
    { logger: m => console.log(m) }
  );

  Promise.all([ocrName, ocrAddress]).then((response) => {
    const [textName, textAddress] = response;
    let name = '';
    for (let i = 0; i < textName.data.text.length; i++) {
      if (textName.data.text[i] != ' ') {
        name = name + textName.data.text[i];
      }
    }
    console.log('name', name)

    let address = '';
    for (let i = 0; i < textAddress.data.text.length; i++) {
      if (textAddress.data.text[i] != ' ') {
        address = address + textAddress.data.text[i];
      }
    }
    console.log('address', address)

    result = { name, address }
    res.send(result);
  });
});
