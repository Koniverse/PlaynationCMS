/**
 * airdrop-campaign service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::airdrop-campaign.airdrop-campaign', ({strapi}) => ({

  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::airdrop-campaign.airdrop-campaign', {
      sort: 'id:asc',
      populate: {
      },
      ...params
    });
    data.forEach((d) => {
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })
    return data
    }
}));
