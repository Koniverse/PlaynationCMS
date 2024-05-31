export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: `/telegram-buttons`,
      handler: 'telegramAction.getButtons',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: `/telegram-trigger`,
      handler: 'telegramAction.trigger',
      config: {
        policies: []
      }
    },
  ],
};
