/**
 * game-item service
 */

import { factories } from '@strapi/strapi';
import {GetValues} from "@strapi/types/dist/types/core/attributes";

export default factories.createCoreService('api::game-item.game-item', ({strapi}) => ({
  async customList(params = {}) {
    const data :GetValues<'api::game-item.game-item'>[]  = await strapi.entityService.findMany('api::game-item.game-item', {
      sort: 'id:asc',
      populate: {
        'icon':true,
        'game': true,
      },
      ...params
    });
    console.log(data)
    data.forEach((d :GetValues<'api::game-item.game-item'>) => {
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
