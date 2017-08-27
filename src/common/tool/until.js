/**
 * Author:shiduobin
 * Create Time:2017-08-26 11:39
 *
 */

/**
 * 解析url函数
 * @example ?id=12345&a=b
 * @returns {{id: number}}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]]+/g;
  let arr = url.match(reg);

  // arr=['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return {id: 123123};
};
