import {spawn} from 'child_process';
import path from 'path';
import EventEmitter from 'events';
import fs from 'fs';
import readDirFiles from 'read-dir-files';

let basename = (filepath = '') => {
  let finalPath = filepath;
  if (typeof filepath !== 'string') {
    finalPath = '';
  }
  return path.basename(finalPath, path.extname(finalPath));
};

export default class PDF extends EventEmitter {
  constructor(filepath, originalName) {
    super();
    this.logFile = __dirname + '/../../../log/' + basename(originalName) + '.log';
    this.filepath = filepath;
    this.optimizedPath = filepath;
  }

  split(tmpPath) {
    const log = fs.createWriteStream(this.logFile, {flags: 'a'});
    let options = ['-sDEVICE=pdfwrite', '-dSAFER', '-o', tmpPath + 'page.%d.pdf', this.filepath];
    let extraction = spawn('gs', options);
    extraction.stderr.pipe(log);
    extraction.stdout.pipe(log);

    return new Promise((resolve) => {
      extraction.stdout.on('close', () => {
        resolve();
      });
    });
  }

  extractText() {
    let tmpPath = '/tmp/' + Date.now() + 'docsplit/';

    return new Promise((resolve, reject) => {
      fs.mkdir(tmpPath, (mkdirError) => {
        if (mkdirError) {
          return reject(mkdirError);
        }

        return this.split(tmpPath)
        .then(() => {
          const log = fs.createWriteStream(this.logFile, {flags: 'a'});
          let command = `docsplit text --no-ocr -o ${tmpPath}txt/ ${tmpPath}page*pdf`;
          let options = ['-c', command];
          let extraction = spawn('/bin/sh', options);
          extraction.stderr.pipe(log);
          extraction.stdout.pipe(log);
          extraction.stdout.on('close', () => {
            readDirFiles.read(`${tmpPath}txt/`, (error, files) => {
              if (error) {
                reject(error);
              }
              let content = {};

              Object.keys(files).forEach((fileName) => {
                const buffer = files[fileName];
                const pageNumber = fileName.split('.')[1];
                content[`page_${pageNumber}`] = buffer.toString('utf8');
              });

              resolve(content);
            });
          });
        });
      });
    });
  }

  convert() {
    return this.extractText()
    .catch(() => {
      return Promise.reject({error: 'conversion_error'});
    })
    .then((fullText) => {
      return {fullText};
    });
  }
}
