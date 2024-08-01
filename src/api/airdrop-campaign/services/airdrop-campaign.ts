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
                        'leaderboard_groups': {
                            populate: {
                                leaderboards: {
                                    populate: {
                                        games: true,
                                        tasks: true,
                                        sharing: true
                                    }
                                }
                            },
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
                // @ts-ignore
                d.leaderboards = d.leaderboard_groups.map((group) => {
                    const {leaderboards} = group;
                    const data = leaderboards.map((leaderboard) => {
                        return {
                            id: leaderboard.id,
                            name: leaderboard.name,
                            slug: leaderboard.slug,
                            sharing: leaderboard.sharing
                        }
                    })
                    return {
                        leaderboardGroupId: group.id,
                        leaderboardGroupName: group.name,
                        leaderboards: data
                    }
                });
                d.leaderboard_groups && delete d.leaderboard_groups;
            });
            return data;
        },
    })
);
