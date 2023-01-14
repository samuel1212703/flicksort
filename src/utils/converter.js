export function year_from_date(date) {
  try {
    return date.split("-")[0];
  } catch (e) {
    return "";
  }
}
