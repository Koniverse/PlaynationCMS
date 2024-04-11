/**
 * task service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::task.task', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::task.task', {
      sort: 'id:asc',
      populate: {
        'game': true,
        'icon': true
      },
      ...params
    });
    data.forEach((d) => {
      // @ts-ignore
      d.gameId = d.game?.id || d.game;
      d.icon = d.icon?.url || d.icon;
      d.game && delete d.game;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })

    return data
  }
}));
