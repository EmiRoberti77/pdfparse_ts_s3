import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { PdfReader } from 'pdfreader';
import dotenv from 'dotenv';
dotenv.config();

async function parsePdf() {
  const params = {
    Bucket: process.env.BUCKET,
    Key: process.env.FILENAME,
  };

  const s3Client = new S3Client({ region: 'us-east-1' });
  const response = await s3Client.send(new GetObjectCommand(params));
  if (!response.Body) {
    console.error('Error:Body is null');
    throw new Error('Error:Body is null');
  }

  const pdfBuffer = Buffer.from(await response.Body.transformToByteArray());

  const textLines: string[] = [];
  new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
    if (err) console.log(err);
    else if (!item) {
      //process at the end of the file to clean up spaces
      const blockedLines = textLines.join(' ').replace(/\s+/g, ' ').trim();
      console.log('Processed Text');
      console.log(blockedLines);
    } else if (item.text) {
      textLines.push(item.text);
    }
  });
}

parsePdf();
