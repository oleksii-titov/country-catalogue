export const updateHistoryState = (path: string) => {
  window.history.pushState(path, '', path);
}