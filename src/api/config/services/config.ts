/**
 * config service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  "api::config.config",
  ({ strapi }) => ({
    async customList(params = {}) {
      const data = await strapi.entityService.findMany(
        "api::config.config",
        {
          sort: "id:asc",
          populate: {
            value: {
                populate: '*',
              ...params
            },
          },
          ...params,
        }
      );
      data.forEach((d) => {
        d.createdAt !== undefined && delete d.createdAt;
        d.updatedAt !== undefined && delete d.updatedAt;
        d.publishedAt !== undefined && delete d.publishedAt;
        d.value.forEach((v) => {
          if (v.game){
            // @ts-ignore
            v.gameId = v.game?.id || v.game;
            v.game && delete v.game;
          }
        })
      });
      return data;
    },
  })
);
