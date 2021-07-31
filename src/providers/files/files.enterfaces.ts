export interface IFileStream {
  fieldName: string;
  file: NodeJS.ReadableStream;
  fileName: string;
  encoding: string;
  mimeType: string;
}
