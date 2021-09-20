let keyijob = "CAURTECHMGF2CAURTECHMGF2";

export function encrypt(text) {
    var CryptoJS = require("crypto-js");
    var key = CryptoJS.enc.Utf8.parse(keyijob);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var encoded = CryptoJS.enc.Utf8.parse(text);
    var ciphertext = CryptoJS.TripleDES.encrypt(encoded, key, { mode: CryptoJS.mode.CBC, iv: iv });

    return ciphertext.toString();
}

export function decrypt(encryptedText) {
    var CryptoJS = require("crypto-js");
    var key = CryptoJS.enc.Utf8.parse(keyijob);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var bytes = CryptoJS.TripleDES.decrypt(encryptedText, key, { mode: CryptoJS.mode.CBC, iv: iv });
    var decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedText;
}
