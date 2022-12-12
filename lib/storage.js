function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStore(key) {
  return JSON.parse(localStorage.getItem(key));
}

export { setStore, getStore };
