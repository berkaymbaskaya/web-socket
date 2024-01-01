// Middleware fonksiyonu
const validateApiKeyMiddle=(apiKey)=>{
    const now=Date.now();
    if(!apiKey){
        return(false)
    }
    const possibilities= decrypt(apiKey);
    if (possibilities.includes(Date.now().toString().slice(0,8)) || possibilities.includes(Date.now().toString().slice(0,9)) ) {
        return(true)
    } else {
        return(false)
    }
}  
const parametreDevTeam=["berkay","veysel","fatih","damla","uğurcan","burak","talha"];
const getStr=()=>{
    const randomIndex = Math.round(Math.random() * (parametreDevTeam.length - 1));
    const randomElement = parametreDevTeam[randomIndex];
    return randomElement;
}
const rc4 = function(key, str) {
	var s = [], j = 0, x, res = '';
	for (var i = 0; i < 256; i++) {
		s[i] = i;
	}
	for (i = 0; i < 256; i++) {
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
	}
	i = 0;
	j = 0;
	for (var y = 0; y < str.length; y++) {
		i = (i + 1) % 256;
		j = (j + s[i]) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
		res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
	}
	return res;
}

function hexToStr(hex) {
 let strHex=hex.toString();
  var str = "";
  for (var i = 0, l = strHex.length; i < l; i += 2) {
    str += String.fromCharCode(parseInt(strHex.substr(i, 2), 16));
  }
  return str;
}


const decrypt = function(hex) {
    var results=[];
    parametreDevTeam.forEach((item)=>{
        results.push(rc4(item, hexToStr(hex)).substr(5));
    })
    return results
};
module.exports = {validateApiKeyMiddle};
  