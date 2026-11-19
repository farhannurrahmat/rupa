export function escapeLike(text) {
  return text.replace(/[\\%_]/g, "\\$&");
}