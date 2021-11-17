/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
export default [
  // Login
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/pages/LoginPage'),
    meta: { middleware: ['guest'] },
  },

  {
    path: '/profile',
    name: 'ProfilePage',
    component: () => import('@/views/pages/ProfilePage'),
    meta: { middleware: ['auth'] },
  },

  {
    path: '/',
    name: 'HomePage',
    redirect: '/dashboard',
  },

  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: () => import('@/views/pages/DashboardPage'),
    meta: { middleware: ['auth'] },
  },

  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/pages/AboutPage'),
  },

  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/pages/FeedbackPage'),
  },

  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/pages/PrivacyPage'),
  },

  {
    path: '/security',
    name: 'Security',
    component: () => import('@/views/pages/SecurityPage'),
  },

  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('@/views/pages/ContactsPage'),
  },

  {
    path: '/auth-about',
    name: 'AuthAbout',
    component: () => import('@/views/pages/AuthAboutPage'),
  },

  {
    path: '/polls/create',
    name: 'PollCreatePage',
    component: () => import('@/views/pages/PollCreatePage'),
    meta: { middleware: ['auth'] },
  },

  {
    path: '/polls/:id/edit',
    name: 'PollEditPage',
    component: () => import('@/views/pages/PollEditPage'),
    meta: { middleware: ['auth'] },
    props: true,
  },

  {
    path: '/polls/:id/preview',
    name: 'PollPreviewPage',
    component: () => import('@/views/pages/PollPreviewPage'),
    meta: { middleware: ['authInvitation'] },
    props: true,
  },

  {
    path: '/polls/:id/vote',
    name: 'PollVotePage',
    component: () => import('@/views/pages/PollVotePage'),
    meta: { middleware: ['auth'] },
    props: true,
  },

  {
    path: '/emails-lists/create',
    name: 'EmailsListCreatePage',
    component: () => import('@/views/pages/EmailsListCreatePage'),
    meta: { middleware: ['auth'] },
  },

  {
    path: '/emails-lists/:id/edit',
    name: 'EmailsListEditPage',
    component: () => import('@/views/pages/EmailsListEditPage'),
    meta: { middleware: ['auth'] },
    props: true,
  },

  // 404 page
  {
    path: '*',
    name: '404Page',
    component: () => import('@/views/pages/404Page'),
  },
];
