/**
 * app-game service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::game.game', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::game.game', {
      sort: 'id:asc',
      populate: {
        'icon': true,
        'rank_definition': true,
        'banner': true,
      },
      ...params
    });
    console.log('data', data)
    data.forEach((d) => {
      d.icon = d.icon?.url || d.icon;
      d.banner = d.banner?.url || d.banner;
    })

    return data
  }
}));

