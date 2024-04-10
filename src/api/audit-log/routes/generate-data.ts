export default {
  routes: [
    {
      method: 'GET',
      path: `/audit-log/generate-data`,
      handler: 'audit-log.generateData',
      config: {
        auth: false
      },
    },
  ],
};
