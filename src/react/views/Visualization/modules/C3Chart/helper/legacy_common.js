export function sum(obj) {
  let sum = 0;
  for (let el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}

export function stringObj(obj) {
  let sum = 0;
  let result = false;
  for (let el in obj) {
    if (obj.hasOwnProperty(el)) {
      if (obj[el] != null) {
        sum += obj[el].length;
      }
    }
  }
  if (sum > Object.keys(obj).length) result = true;
  return result;
}

export function toInteger(number) {
  return Math.round(
    // round to the nearest integer
    Number(number) // type cast your input
  );
}
