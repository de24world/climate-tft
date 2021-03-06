/**
 * @return {string} yyyy-mm-dd
 */
export const now = () => {
  const date = new Date();
  var yyyy = date.getFullYear().toString();
  var MM = pad(date.getMonth() + 1, 2);
  var dd = pad(date.getDate(), 2);
  return `${yyyy}-${MM}-${dd}`;
};

/**
 * @return {string} yyyy-mm-dd hh:ss
 */
export const nowDttm = () => {
  const date = new Date();
  var yyyy = date.getFullYear().toString();
  var MM = pad(date.getMonth() + 1, 2);
  var dd = pad(date.getDate(), 2);
  var hh = pad(date.getHours(), 2);
  var mm = pad(date.getMinutes(), 2);
  var ss = pad(date.getSeconds(), 2);
  return `${yyyy}-${MM}-${dd} ${mm}:${ss}`;
};

function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}
