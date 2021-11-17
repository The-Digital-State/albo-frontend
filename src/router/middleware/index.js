import authenticate from './authenticate';
import authenticateByInvitation from './authenticateByInvitation';
import redirectIfAuthenticated from './redirectIfAuthenticated';
import findMe from './findMe';

export default {
  /**
     * The application's global HTTP middleware stack.
     * These middleware are run during every request to your application.
     */
  global: {
    before: [],
    after: [findMe],
  },

  /**
     * The application's route middleware groups.
     */
  group: {
    auth: [
      authenticate,
      authenticateByInvitation,
    ],
  },

  /**
     * The application's route middleware.
     * These middleware may be assigned to groups or used individually.
     */
  route: {
    findMe,
    guest: redirectIfAuthenticated,
    authInvitation: authenticateByInvitation,
  },
};
