export const paths = {
  auth: {
    login: {
      path: 'auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    forgotPassword: {
      path: 'auth/forgot-password',
      getHref: () => '/auth/forgot-password',
    },
    resetPassword: {
      path: 'auth/reset-password',
      getHref: () => '/auth/reset-password',
    },
  },
  dashboard: {
    home: {
      path: '/',
      getHref: () => '/',
    },
    profile: {
      path: '/profile',
      getHref: () => '/profile',
    },
  },
};
