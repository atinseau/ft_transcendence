
const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const formatUserName = (username: string) => {
  return removeAccents(username.toLowerCase().replace(/[ ']/g, '-'))
}

export default formatUserName