import { Request } from 'express';
import { IFileStream } from 'src/providers/files/files.enterfaces';

const Busboy = require('busboy');

export const passFileToFunc = function (request: Request, field: string, cb: Function) {
  const busboy = new Busboy({ headers: request.headers });
  return new Promise((resolve) => {
    const result = [];
    busboy.on('file', async (fieldName, file, fileName, encoding, mimeType) => {
      if (fieldName === field) {
        console.log(fieldName, file, fileName, encoding, mimeType);
        const fileData: IFileStream = { fieldName, file, fileName, encoding, mimeType };

        cb(fileData);
      }
      file.resume();
    });
    busboy.on('finish', async () => {
      resolve(Promise.all(result));
    });

    request.pipe(busboy);
  });
};
