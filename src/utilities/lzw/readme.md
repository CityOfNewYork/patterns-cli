# LZW

[LZW is a compression algorithm](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch) which can be used to compress a configuration into a smaller format for sharing. The LZW Utility offers two methods, `.encode()` and `.decode()`.

## Usage

    import LZW from '@nycopportunity/patterns-framework/src/utilities/lzw/lzw';

### Encode

    let myConfig = {
      'key': 'value'
    };

    let myConfigBase64 = btoa(JSON.strinify(myConfig));

    // Accepts a Base64 encoded string.
    let myConfigLZW = LZW.encode(myConfigBase64);

### Decode

    let myConfig = JSON.parse(atob(LZW.decode(myConfigLZW)));

    // Accepts a Base64 decoded string.
    LZW.decode(myConfig);