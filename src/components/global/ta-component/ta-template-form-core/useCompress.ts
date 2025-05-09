// LZW-compress a string
export const compressEncode = (s: string) => {
  const dict: Record<string, number> = {};
  const data = (s + '').split('');
  const out: (string | number)[] = [];
  let currChar: string;
  let phrase = data[0];
  let code = 256;
  for (let i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[`${phrase}${currChar}`] = code;
      code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (let i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(Number(out[i]));
  }
  return out.join('');
};

// Decompress an LZW-encoded string
export const compressDecode = (s: string) => {
  const dict: Record<number, string> = {};
  const data = (s + '').split('');
  let currChar = data[0];
  let oldPhrase = currChar;
  const out = [currChar];
  let code = 256;
  let phrase;
  for (let i = 1; i < data.length; i++) {
    const currCode: number = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }
  return out.join('');
};
