
export class JsonReader {
    static async read(filePath: string): Promise<any> {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      return await response.json();
    }
  }