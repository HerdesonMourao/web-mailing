import * as fs from 'fs';

export default class FileHandler {
  public static readFiles(folderPath: string): string[] {
    return fs.readdirSync(folderPath).map(file => `${folderPath}/${file}`);
  }

  public static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  public static writeFile(filePath: string, data: string): void {
    fs.writeFileSync(filePath, data);
  }

  public static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}