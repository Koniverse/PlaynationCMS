/**
 * eligibility-list service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
    "api::eligibility-list.eligibility-list",
    ({ strapi }) => ({
        async customList(params = {}) {
            const data = await strapi.entityService.findMany(
                "api::eligibility-list.eligibility-list",
                {
                    sort: "id:asc",
                    ...params,
                    populate: {
                       'airdrop_campaign_id':true
                    },
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
