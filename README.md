# PDF Parser with AWS S3 and PDFReader
This Node.js script reads a PDF file from an AWS S3 bucket, extracts its text content using the pdfreader library, and processes the text to remove unnecessary spaces and formatting for easy use, such as sending to an LLM (Large Language Model).

## Features
Reads a PDF file from an AWS S3 bucket.
Extracts and parses the text using pdfreader.
Cleans up spaces and formatting, combining all text into a single block for easier consumption.

## Prerequisites
Node.js: Ensure you have Node.js installed on your system.
AWS Credentials: Configure AWS credentials with access to the S3 bucket.
Environment Variables: Create a .env file with the following variables:
BUCKET: The name of the S3 bucket where the PDF is stored.
FILENAME: The key (filename) of the PDF in the bucket.

## Installation
Clone the repository or copy the script to your project directory.
Install the required dependencies

```bash
npm install @aws-sdk/client-s3 pdfreader dotenv
```
Create a .env file in the root of the project with the following content:

```bash
BUCKET=your-bucket-name
FILENAME=your-file-name.pdf
```

## The code will:

Fetch the specified PDF from S3.
Extract its text content.
Process and clean up the text, logging the final output to the console.

```typescript
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
```
