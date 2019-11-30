export function sortByKey(array, key) {
  return array.sort(function(a, b) {
    let x = a[key].toLowerCase();
    let y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

export function sortByDate(array, vector = "-") {
  return array.sort(function(a, b) {
    if (vector === "+") {
      return new Date(b["date"]) + new Date(a["date"]);
    }
    return new Date(b["date"]) - new Date(a["date"]);
  });
}

export function sortUsersByName(users) {
  let usersBySorte = [];
  users.map(user => {
    let mail = user.Attributes.find(x => x.Name === "email").Value;
    const name = user.Attributes.find(x => x.Name === "name")
      ? user.Attributes.find(x => x.Name === "name").Value
      : mail;
    return usersBySorte.push({
      name,
      id: mail,
      checked: true
    });
  });
  return sortByKey(usersBySorte, "name");
}

export function orderAlphabetically(string1, string2) {
  string1 = string1.toUpperCase();
  string2 = string2.toUpperCase();
  return string1 < string2 ? -1 : string1 > string2 ? 1 : 0;
}
