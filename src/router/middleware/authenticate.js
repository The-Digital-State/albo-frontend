export default async function (to, from, next) {
  const { $store } = this;

  // check if user authenticated
  if (!$store.getters['auth/authenticated']) {
    // save route for redirection after authorization
    localStorage.setItem('AUTH_REDIRECT_TO', JSON.stringify(to));

    /*
         * If the user is not authenticated and visits
         * a page that requires authentication, redirect to the login page
         */
    return next({ name: 'LoginPage' });
  }

  return next();
}
