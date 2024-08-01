/**
 * leaderboard service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService('api::leaderboard.leaderboard', ({strapi}) => ({
    async customList(params = {}) {
        const data = await strapi.entityService.findMany('api::leaderboard.leaderboard', {
            sort: 'id:asc',
            populate: {
                games: true,
                tasks: true
            },
            ...params
        });
        const leaderboardConfigData = await strapi.entityService.findMany('api::general-leaderboard.general-leaderboard', {
            sort: 'id:asc',
            populate: {
                leaderboard_groups: {
                    populate: {
                        leaderboards: {
                            populate: {
                                games: true,
                                tasks: true
                            }
                        }
                    },
                    ...params
                }
            },
            ...params
        });
        let leaderboard_general = {};
        if  (leaderboardConfigData) {
            const {leaderboard_groups} = leaderboardConfigData;
            console.log('leaderboard_groups', leaderboard_groups)
            // @ts-ignore
            leaderboard_general = leaderboard_groups.map((group) => {
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

        }
        data.forEach((d) => {
            d.createdAt !== undefined && delete d.createdAt;
            d.updatedAt !== undefined && delete d.updatedAt;
            d.publishedAt !== undefined && delete d.publishedAt;
            // @ts-ignore
            d.games = d.games.map((game) => game.id);
            // @ts-ignore
            d.tasks = d.tasks.map((task) => task.id);
        })

        return {
            data,
            leaderboard_general
        }
    }
}));
