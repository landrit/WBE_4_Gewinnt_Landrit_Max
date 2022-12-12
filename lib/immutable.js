// ..

function setInList(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

function setInObj(obj, attr, val) {
  // ..
}

export { setInList, setInObj };
