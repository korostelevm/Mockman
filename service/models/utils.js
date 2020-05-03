const clean_object = function (obj) {
    Object.keys(obj).forEach(function(key) {
      (obj[key] && typeof obj[key] === 'object') && clean_object(obj[key]) ||
      (obj[key] === '' || obj[key] === null) && delete obj[key]
    });
    return obj;
  };

module.exports={
    clean_object
}