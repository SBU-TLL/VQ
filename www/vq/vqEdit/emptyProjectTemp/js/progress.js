function Progress(dictName) {

  var progressDict = JSON.parse(localStorage.getItem(dictName)) || {};

  this.setKey = function(key,val) {
    progressDict[key] = val;
    localStorage.setItem(dictName, JSON.stringify(progressDict))


  };
  this.getKey = function(key) {
    progressDict = JSON.parse(localStorage.getItem(dictName)) || {};
    return progressDict[key]||false;


  };
}

function getUrlVars() {
  var vars = [],hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');

    if ($.inArray(hash[0], vars) > -1) {
      vars[hash[0]] += "," + hash[1];
    } else {
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
  }

  return vars;
}

function clearStorage(){
  localStorage.clear();
}
