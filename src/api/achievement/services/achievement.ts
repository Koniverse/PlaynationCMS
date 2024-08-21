/**
 * achievement service
 */

import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::achievement.achievement', ({strapi}) => ({
  async customList(params = {}) {

    const achievementCategory = await strapi.entityService.findMany('api::achievement-category.achievement-category', {
      sort: 'id:asc',
      populate: {
        'icon': true
      },
      ...params
    });
    achievementCategory.forEach((d) => {
      d.icon = d.icon?.url || d.icon;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
    })
    const achievement = await strapi.entityService.findMany('api::achievement.achievement', {
      sort: 'id:asc',
      populate: {
        'icon': true,
        'metrics': {
          populate: {
              'games': true,
              'tasks': true
            }
        },
        'achievement_category' : true,
        'milestones' : {
            populate: {
              'conditions': true
            }
        }
      },
      ...params
    });
    achievement.forEach((d) => {
      d.icon = d.icon?.url || d.icon;
        // @ts-ignore
      d.achievementCategoryId = d.achievement_category.id || d.achievement_category;
      d.achievement_category && delete d.achievement_category;
      d.createdAt !== undefined && delete d.createdAt;
      d.updatedAt !== undefined && delete d.updatedAt;
      d.publishedAt !== undefined && delete d.publishedAt;
      d.metrics.forEach((m) => {
        // @ts-ignore
        m.games = m.games.map((game) => game.id);
        // @ts-ignore
        m.tasks = m.tasks.map((task) => task.id);
      });
    })

    return {achievementCategory, achievement}
  }
}));
