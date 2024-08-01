/**
 * app-game service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService('api::game.game', ({strapi}) => ({
    async customList(params = {}) {
        const data = await strapi.entityService.findMany('api::game.game', {
            sort: 'id:asc',
            populate: {
                'icon': true,
                'rank_definition': true,
                'banner': true,
                'leaderboard_groups': {
                    populate: {
                         leaderboards: {
                            populate: {
                                games: true,
                                tasks: true
                            }
                        }
                    },
                    ...params
                },
            },
            ...params
        });
        data.forEach((d) => {
            d.icon = d.icon?.url || d.icon;
            d.banner = d.banner?.url || d.banner;
            d.createdAt !== undefined && delete d.createdAt;
            d.updatedAt !== undefined && delete d.updatedAt;
            d.publishedAt !== undefined && delete d.publishedAt;
            // @ts-ignore
            d.leaderboards = d.leaderboard_groups.map((group) => {
                const {leaderboards} = group;
                leaderboards.forEach((leaderboard) => {
                    leaderboard.createdAt !== undefined && delete leaderboard.createdAt;
                    leaderboard.updatedAt !== undefined && delete leaderboard.updatedAt;
                    leaderboard.publishedAt !== undefined && delete leaderboard.publishedAt;

                    // @ts-ignore
                    leaderboard.games = leaderboard.games.map((game) => game.id);
                    // @ts-ignore
                    leaderboard.tasks = leaderboard.tasks.map((task) => task.id);
                })
                return {
                    leaderboardGroupId: group.id,
                    leaderboardGroupName: group.name,
                    leaderboards
                }
            });
            d.leaderboard_groups && delete d.leaderboard_groups;
        })

        return data
    }
}));

