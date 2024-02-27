import WhatsappClient from './whatsapp-client';
import FileHandler from './file-handler';
import dotenv from 'dotenv';
import { MessageMedia } from 'whatsapp-web.js';

dotenv.config();

const fileFolderPath = process.env.FILE_FOLDER_PATH;
const phoneNumber = process.env.PHONE_NUMBER;

async function sendMessagesInBatches(client: WhatsappClient, files: string[]) {
  const batchSize: number = Number(process.env.BATCH_SIZE);

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    const mediaPromises = batch.map(filePath => MessageMedia.fromFilePath(filePath));
    const media = await Promise.all(mediaPromises);

    await client.sendMessage(phoneNumber as string, media);
  }
}

(async () => {
  let session: any = null;

  const sessionFile = './session.json';

  if (FileHandler.fileExists(sessionFile)) {
    const sessionData = FileHandler.readFile(sessionFile);

    session = JSON.parse(sessionData);
  }

  const client = new WhatsappClient(session);

  await client.authenticate();

  await client.initialize();

  const files = FileHandler.readFiles(fileFolderPath as string);

  await sendMessagesInBatches(client, files);

  console.log('Arquivos enviados com sucesso');

  if (client.isInitialized() && !session) {
    FileHandler.writeFile(sessionFile, JSON.stringify(client.getSession()));
  }
})