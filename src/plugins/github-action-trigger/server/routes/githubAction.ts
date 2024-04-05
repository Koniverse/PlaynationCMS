export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: `/buttons`,
      handler: 'githubAction.getButtons',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: `/trigger`,
      handler: 'githubAction.trigger',
      config: {
        policies: []
      }
    },
  ],
};
