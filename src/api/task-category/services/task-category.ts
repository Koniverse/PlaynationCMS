/**
 * task-category service
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreService('api::task-category.task-category', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::task-category.task-category', {
      sort: 'id:asc',
      populate: {
        'icon': true
      },
      ...params
    });
    data.forEach((d) => {
      d.icon = d.icon?.url || d.icon;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })

    return data
  }
}));
