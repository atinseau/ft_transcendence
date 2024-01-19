


const convertFileToBase64 = (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {

    reader.readAsDataURL(file);

    reader.onerror = () => {
      reader.abort();
      reject(new Error('Problem parsing input file.'));
    };
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return
      }
      reject(new Error('Problem parsing input file.'));
    };
  });
}

export default convertFileToBase64;