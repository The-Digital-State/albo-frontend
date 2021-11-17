export default async function (to, from, next, redirect = { path: '/' }) {
  const { $store } = this;

  // check if user is authenticated
  if ($store.getters['auth/authenticated']) {
    /*
     * If the user is authenticated and visits
     * an guest page, redirect to the dashboard page
     */
    return next(redirect);
  }

  return next();
}
