/**
 * give-away-point service
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreService('api::give-away-point.give-away-point', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::give-away-point.give-away-point', {
      sort: 'id:asc',
      ...params
    });
    data.forEach((d) => {
      // @ts-ignore
      d.contentId = d.id;
    })

    return data
  }
}));
