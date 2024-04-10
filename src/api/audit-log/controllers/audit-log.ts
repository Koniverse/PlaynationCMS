/**
 * audit-log controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::audit-log.audit-log', ({ strapi }) => ({
  async generateData() {
    return await strapi.services['api::audit-log.audit-log'].generateData();
  },
}));
