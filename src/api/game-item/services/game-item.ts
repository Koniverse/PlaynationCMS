/**
 * game-item service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::game-item.game-item', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::game-item.game-item', {
      sort: 'id:asc',
      populate: {
        'game': true,
      },
      ...params
    });
    data.forEach((d) => {
      // @ts-ignore
      d.gameId = d.game?.id || d.game;
      d.game && delete d.game;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })

    return data
  }
}));
