/**
 * A set of functions called "actions" for `listing`
 */

export default {
  listAll: async (ctx, next) => {
    try {
      const pluralId = ctx.params.pluralId as string;
      const showPreview = ctx.query?.preview;
      const locale = ctx.query?.locale || 'en';

      const generalParams = {
        publicationState: showPreview ? 'preview' : 'live',
        locale
      }

      let result = [];

      // remove some fields
      if (result.length) {
        result.forEach((r) => {
          r.createdAt !== undefined && delete r.createdAt;
          r.updatedAt !== undefined && delete r.updatedAt;
          r.publishedAt !== undefined && delete r.publishedAt;
        })
      }

      ctx.body = result;
    } catch (err) {
      ctx.body = err;
    }
  },
  triggerAutoFetch: async (ctx, next) => {
    const pluralId = ctx.params.pluralId as string;
    if (pluralId === 'crowdloan-fund') {
      await strapi.service('api::crowdloan-fund.crowdloan-fund').autoGetFunds();
      ctx.body = `Fetch api::crowdloan-fund.crowdloan-fund from Subscan`
    } else {
      ctx.body = 'Not Found'
    }
  }
};
