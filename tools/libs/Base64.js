////////////////////////////////////////
//
// Base64
//
/* eslint-disable no-bitwise, no-multi-assign */

(function () {
	'use strict';

    // private property
    const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    // private method for UTF-8 encoding
    function _utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        let utftext = '';
        for (let n = 0, nlen = string.length; n < nlen; n++) {
            let c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    function _utf8Decode(utftext) {
        let string = '';
        let i = 0;
        let c = 0;
        let c2 = 0;
        let c3 = 0;
        const utftextLength = utftext.length;
        while (i < utftextLength) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    // public method for encoding
    function encode(input, keyStr, isUTF8) {
        let output = '';
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;

        if (!keyStr) {
            keyStr = _keyStr;
        }

        if (isUTF8) {
            input = _utf8Encode(input);
        }
        const inputLength = input.length;
        while (i < inputLength) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
                // eslint-disable-next-line no-restricted-globals
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output
                + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    function decode(input, keyStr, isUTF8) {
        let output = '';
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        if (!keyStr) {
            keyStr = _keyStr;
            //  已有的默认模式
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        } else {
            // 只考虑清理空白符号就够了
            input = input.replace(/[\s]/g, '');
        }

        const inputLength = input.length;
        while (i < inputLength) {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output += String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }
        }
        if (isUTF8) {
            output = _utf8Decode(output);
        }
        return output;
    }

    var Base64 = {
        encode: encode,
        decode: decode,
    };


    // Nodejs
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Base64;
		}
		exports.Base64 = Base64;
	}
	// AMD / REQUIRE
	else if (typeof define === 'function' && define.amd) {
		define(function (require) { return Base64; });
	}
	// Browser
	else if (typeof window != 'undefined') {
		window.Base64 = Base64;
	}
	// Web Worker
	else if (typeof self !== 'undefined') {
		self.Base64 = Base64;
	}

})();
