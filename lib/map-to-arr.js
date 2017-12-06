module.exports = function (map) {
  var list = [];
  for (let [k, v] of map) {  
    list.push([k, v]);
  }  
  return list;
}
