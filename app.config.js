export default {
  expo: {
    name: 'd-leap-app',
    slug: 'd-leap-app',
    // ...其他設定
    android: {
      package: 'com.wuyen.dleap',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    extra: {
      eas: {
        projectId: '4a4bf6c2-bfba-4071-9f6f-3014b76069af',
      },
    },
  },
};
