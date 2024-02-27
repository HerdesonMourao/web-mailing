import { Client, ClientSession } from 'whatsapp-web.js';
import * as fs from 'fs';

export default class WhatsappClient {
  private client: Client;
  private initialized: boolean;
  private session?: ClientSession;

  constructor(session?: ClientSession) {
    this.client = new Client({ session });
    this.initialized = false;
    this.session = session;
  }

  public async authenticate() {
    const sessionFile = '../session.json';

    if (fs.existsSync(sessionFile)) {
      const sessionData = fs.readFileSync(sessionFile, 'utf-8');
      const session = JSON.parse(sessionData);

      this.session = JSON.parse(session);
      this.client = new Client(session);
    } else {
      this.client.on('qr', (qr) => {
        console.log('Escaneie o QR code: ', qr);
      });

      this.client.on('authenticated', (session) => {
        console.log('Autenticado com sucesso');

        this.session = session;

        fs.writeFileSync(sessionFile, JSON.stringify(session));
      });
    }
  }

  public async initialize() {
    await this.client.initialize();

    this.initialized = true;
  }

  public async sendMessage(phoneNumber: string, media: any[]) {
    await this.client.sendMessage(phoneNumber, media);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getSession(): ClientSession | undefined {
    return this.session;
  }
}