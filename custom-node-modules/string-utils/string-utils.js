

var strUtils = new Object();

strUtils.format = function(str, formatArgsArray)
{
	return str.replace(/{(\d+)}/g, function(match, number) { 
      return typeof formatArgsArray[number] != 'undefined'
        ? formatArgsArray[number]
        : match
      ;
    });
}

strUtils.replaceAll = function(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

strUtils.lineBreak = function () { 
    return '\r\n';
}

module.exports = strUtils;