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
                leaderboards: {
                    populate: '*',
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
            d.leaderboards.forEach((v) => {
                if (v.game) {
                    // @ts-ignore
                    v.gameId = v.game?.id || v.game;
                    v.game && delete v.game;
                }
            })
        })

        return data
    }
}));

