/**
 * Author:shiduobin
 * Create Time:2017-08-26 11:57
 *
 */

/**
 * localstorage 存储 收藏商家
 * window.localStorage = __seller__
 * 存储函数 saveToLocal(id,key,value)
 * 读取函数 loadFormLocal(id,key,default)
 * @param id
 * @param key
 * @param value
 */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromLocal(id, key, def) {
  // def:default默认值
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }

  // es6不可多次声明同一个变量
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}
