/**
 * telegram-notification service
 */

import {factories} from '@strapi/strapi';
function isLink(input: string): boolean {
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  return regex.test(input);
}
export default factories.createCoreService(
    "api::telegram-notification.telegram-notification",
    ({strapi}) => ({
        async getDataContent(id: number) {
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

                const isAllLink = data.reply_markup.every((reply) => {
                    return isLink(reply.url);
                })
                if (!isAllLink){
                    response.message = "All buttons url must be a link";
                    return response;
                }
                const buttons = data.reply_markup.map((reply) => {
                    return {
                        text: reply.text,
                        web_app: {
                            url: reply.url,
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
