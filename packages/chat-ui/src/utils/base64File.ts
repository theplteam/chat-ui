export const base64FileDecode = (input: string) => {
  // Ожидаем формат: filename=example.txt;data:mimetype;base64,...
  const match = input.match(/^filename=([^;]+);data:(.*);base64,(.*)$/);
  if (!match) throw new Error('Incorrect format');
  const fileName = match[1];
  const mimeType = match[2];
  const b64Data = match[3];
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: mimeType });
};

export const base64FileEncode = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === 'string') {
      resolve(`filename=${file.name};${result}`);
    }
  };
  reader.onerror = (e) => reject(e);
  reader.readAsDataURL(file);
});
