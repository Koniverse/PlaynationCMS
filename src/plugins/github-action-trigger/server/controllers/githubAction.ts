/**
 * A set of functions called "actions" for `listing`
 */
import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getButtons: async (ctx, next) => {
    const {apiID} = ctx.request.query;
    ctx.body = await strapi.plugin('github-action-trigger').service('githubAction').getButtons(apiID);
  },
  trigger: async (ctx, next) => {
    const {buttonID} = ctx.request.body;
    ctx.body = await strapi.plugin('github-action-trigger').service('githubAction').trigger(buttonID);
  }
});
