/**
 * airdrop-campaign service
 */

import {factories} from "@strapi/strapi";

export default factories.createCoreService(
    "api::airdrop-campaign.airdrop-campaign",
    ({strapi}) => ({
        async customList(params = {}) {
            const data = await strapi.entityService.findMany(
                "api::airdrop-campaign.airdrop-campaign",
                {
                    sort: "id:asc",
                    populate: {
                        icon: true,
                        banner: true,
                        share: true,
                        leaderboards: {
                            populate: '*',
                            ...params
                        },
                    },
                    ...params,
                }
            );
            data.forEach((d) => {
                d.icon = d.icon?.url || d.icon;
                d.banner = d.banner?.url || d.banner;
                d.createdAt !== undefined && delete d.createdAt;
                d.updatedAt !== undefined && delete d.updatedAt;
                d.publishedAt !== undefined && delete d.publishedAt;
                // d.leaderboards.forEach((v) => {
                //     if (v.game) {
                //         // @ts-ignore
                //         v.gameId = v.game?.id || v.game;
                //         v.game && delete v.game;
                //     }
                // })
            });
            return data;
        },
    })
);
