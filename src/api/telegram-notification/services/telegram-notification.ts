/**
 * telegram-notification service
 */

import {factories} from '@strapi/strapi';
export default factories.createCoreService(
    "api::telegram-notification.telegram-notification",
    ({strapi}) => ({
        async getDataContent(id: number, botUrl:string) {
            // const id = 1;
            const data = await strapi.entityService.findOne(
                "api::telegram-notification.telegram-notification", id,
                {
                    sort: "id:asc",
                    populate: {
                        photo: true,
                        reply_markup: true,
                    },
                    publicationState: 'preview',
                    locale: 'en'
                }
            );
            const response = {
                status: false,
                data: null,
                message: "Data not found",
            }
            if (!data || (data && !data.publishedAt)) {
                response.message = "Data send not published";
                return response;
            }
            const photo = data.photo?.url || null;
            if (!photo) {
                response.message = "Photo is required";
                return response;
            }
            const result = {
                caption: data.caption,
                parse_mode: data.parse_mode,
                photo: data.photo?.url || data.photo,
                reply_markup: {
                    inline_keyboard: []
                },

            };
            if (data.reply_markup) {

                const buttons = data.reply_markup.map((reply) => {
                    return {
                        text: reply.text,
                        web_app: {
                            url: `${botUrl}${reply.screen ?? ''}`,
                        },
                    };
                });
                result.reply_markup.inline_keyboard.push(buttons);
            }
            response.status = true;
            response.data = result;
            response.message = "Success";
            return response;
        },
    })
);
