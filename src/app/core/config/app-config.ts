export const AppConfig = {
  appName:     'وزارة التجارة',
  appNameEn:   'Ministry of Commerce',
  browserTitle: 'وزارة التجارة ',

  // Logos — update paths here to change across the whole app
  headerLogo: 'images/Rightside.png',
  loginLogo:  'images/logo.png',
  publicLogo: 'images/default-logo.png',

  // Roles allowed to access the portal — add more entries here to grant access
  allowedRoles: [
    'MC - Customer Service Representative',
  ] as readonly string[],
} as const;
