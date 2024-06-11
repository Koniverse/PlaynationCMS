/**
 * eligibility-list service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
    "api::account-baned.account-baned",
    ({ strapi }) => ({
        async customList(params = {}) {
            const data = await strapi.entityService.findMany(
                "api::account-baned.account-baned",
                {
                    sort: "id:asc",
                    ...params,
                }
            );
            data.forEach((d) => {
                d.createdAt !== undefined && delete d.createdAt;
                d.updatedAt !== undefined && delete d.updatedAt;
                d.publishedAt !== undefined && delete d.publishedAt;
            });
            return data;
        },
    })
);
