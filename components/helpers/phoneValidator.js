export function phoneValidator(phone) {
  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (!phone) return "Telefonul e obligatoriu.";
  // if (!re.test(phone)) return "Ooops! Introdu un numar valid.";
  return "";
}
