export function findUser(_arrayList) {
  const userName = localStorage.getItem("username");

  return _arrayList.filter((elem) => {
    if (elem.name === userName) {
      return elem.id;
    }
  });
}
