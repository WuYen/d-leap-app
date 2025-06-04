import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      SERVER_URL: process.env.SERVER_URL,
      ENV: process.env.ENV, // 新增 ENV
      // 你可以在這裡加更多變數
    },
  };
};
