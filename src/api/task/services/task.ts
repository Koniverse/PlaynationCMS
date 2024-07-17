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
        'icon': true,
        'task_category': true,
        'share_leaderboard': true,
        'achievement': true
      },
      ...params
    });
    data.forEach((d) => {
      // @ts-ignore
      d.gameId = d.game?.id || d.game;
      // @ts-ignore
      d.categoryId = d.task_category?.id || d.task_category;
      d.icon = d.icon?.url || d.icon;
      d.game && delete d.game;
      d.task_category && delete d.task_category;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })

    return data
  }
}));
