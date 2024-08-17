/**
 * metadata-config service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService('api::metadata-config.metadata-config', ({strapi}) => ({
  async customList(params = {}) {
    const data = await strapi.entityService.findMany('api::metadata-config.metadata-config', {
      sort: 'id:desc',
      populate: {
        versions: {
          populate: {
            application: {populate: ['version', 'minVersion']},
            game: {populate: ['version', 'minVersion']},
            task: {populate: ['version', 'minVersion']},
            airdrop: {populate: ['version', 'minVersion']},
            achievement: {populate: ['version', 'minVersion']},
            leaderboard: {populate: ['version', 'minVersion']}
          }
        },
        maintenanceInfo: true
      },
      ...params
    });

    const result = data[0];

    // Remove some fields
    result.id = undefined
    result.versions.id = undefined
    result.versions.application.id = undefined
    if (result.versions.game) {
      result.versions.game.id = undefined
    }
    if (result.versions.task) {
      result.versions.task.id = undefined
    }
    if (result.versions.airdrop) {
      result.versions.airdrop.id = undefined
    }
    if (result.versions.achievement) {
      result.versions.achievement.id = undefined
    }
    if (result.versions.leaderboard) {
      result.versions.leaderboard.id = undefined
    }
    result.maintenanceInfo.id = undefined

    return result;
  }
}));
