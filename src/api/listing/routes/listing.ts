export default {
  routes: [
    {
      method: 'GET',
      path: `/list/:pluralId`,
      handler: 'listing.listAll',
      config: {
        auth: false
      },
    },
    {
      method: 'POST',
      path: `/trigger/:pluralId`,
      handler: 'listing.triggerAutoFetch'
    }
  ],
};
