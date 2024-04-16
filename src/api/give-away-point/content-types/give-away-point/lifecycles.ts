export default {
  afterCreate: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog(event);
  },
  afterCreateMany: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog(event);
  },
  beforeDelete: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog(event);
  },
  beforeDeleteMany: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog(event);
  },
  afterUpdate: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog( event);
  },
  afterUpdateMany: async (event: Event) => {
    await strapi.services['api::audit-log.audit-log'].handleAuditLog( event);
  }
};
