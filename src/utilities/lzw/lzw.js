/**
 * LZW Compression Algorithim
 * @url https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
 */
class LZW {
  constructor() {
    return this;
  }
}

LZW.encode = function(s) {
  if (!s) return s;
  var dict = new Map();
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;

  for (var i = 1; i < data.length; i++) {
      currChar = data[i];
      if (dict.has(phrase + currChar))
          phrase += currChar;
      else {
          out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));
          dict.set(phrase + currChar, code);
          code++;
          phrase = currChar;
      }
  }

  out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));

  for (var i = 0; i < out.length; i++)
    out[i] = String.fromCharCode(out[i]);

  return out.join("");
}

LZW.decode = function(s) {
  var dict = new Map(); // Use a Map!
  var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;

  for (var i = 1; i < data.length; i++) {
    var currCode = data[i].charCodeAt(0);

    if (currCode < 256)
      phrase = data[i];
    else
      phrase = dict.has(currCode) ? dict.get(currCode) : (oldPhrase + currChar);

    out.push(phrase);
    currChar = phrase.charAt(0);
    dict.set(code, oldPhrase + currChar);
    code++;
    oldPhrase = phrase;
  }

  return out.join("");
}

export default LZW;
