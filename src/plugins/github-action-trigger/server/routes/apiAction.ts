export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: `/api-buttons`,
      handler: 'apiAction.getButtons',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: `/api-trigger`,
      handler: 'apiAction.trigger',
      config: {
        policies: []
      }
    },
  ],
};
