/**
 * listing service
 */
import axios from 'axios';
import {Strapi} from "@strapi/strapi";
import {GithubActionEnabledResponse, TriggerButtonInfo} from "../../types";

const getHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`,
})

export default ({strapi}: { strapi: Strapi }) => ({
    async getRequireRoles(apiID: string) {
        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;
        const roleIds = user.roles.map((role) => role.id);
        const singularName = `api::${apiID}.${apiID}`;
        const permissionList = await strapi.entityService.findMany('admin::permission', {
            filters: {
                subject: singularName,
                role: {
                    id: {
                        $in: roleIds
                    }
                }
            },
            populate: ['role'],
        });
        // @ts-ignore
        return permissionList && permissionList.reduce((currentValue, permission) => {
            const actionSplit = permission.action.split('.');
            if (actionSplit.length > 0) {
                currentValue.push(actionSplit[actionSplit.length - 1]);
            }
            return currentValue;
        }, []);
    },
    async getButtons(apiID: string) {
        // @ts-ignore
        const actions = await strapi.admin.config.telegramActions;
        const {triggerButtons} = actions;
        let enabled = false;
        const requireRoles = await this.getRequireRoles(apiID);


        const buttons: TriggerButtonInfo[] = (triggerButtons || [])
            .filter((button) => button.apiID === apiID && (!button.roles || button.roles.length === 0 || button.roles.every((role) => requireRoles.includes(role))))
            .map(({
                      buttonID,
                      apiID,
                      label,
                      variant,
                      roles
                  }) => ({
                buttonID,
                apiID,
                label,
                variant,
                roles
            }));
        if (buttons.length > 0) {
            enabled = true;
        }
        const auditLogs = await strapi.entityService.findMany('api::audit-log.audit-log', {
            filters: {
                action: 'send_notification_production',
            },
            sort: 'createdAt:desc',
            limit: 1
        })

        return {
            enabled,
            buttons,
            lastTriggered: auditLogs.length > 0 ? auditLogs[0].createdAt : null
        } as GithubActionEnabledResponse;
    },
    async trigger(buttonID: string, id: number) {
        // @ts-ignore
        const actions = await strapi.admin.config.telegramActions;
        const {triggerButtons, apiToken, apiActionUrl, apiActionDevelopmentUrl, botDevelopmentUrl, botUrl} = actions;
        let hostUrl = apiActionUrl;
        let webappUrl = botUrl;
        let executed = false;

        const buttonInfo = triggerButtons.find((button) => button.buttonID === buttonID);
        const {enabled} = await this.getButtons(buttonInfo.apiID);
        if (!enabled) {
            return {
                executed,
            }
        }

        if (buttonInfo) {
            executed = true;
            let isProduction = true;
            const {singularName, routerApi, environment} = buttonInfo;
            if (environment === 'development') {
                hostUrl = apiActionDevelopmentUrl;
                isProduction = false;
                webappUrl = botDevelopmentUrl;
            }
            const contentSend = await strapi.service(singularName).getDataContent(id, webappUrl);
            const {status, message, data} = contentSend;
            if (!status) {
                return {
                    type: 'warning',
                    status: false,
                    message
                }
            }
            try {
                const url = `${hostUrl}${routerApi}`;
                await axios.post(url, data, {headers: getHeaders(apiToken)});

                await strapi.services['api::audit-log.audit-log'].addAuditLogSendNotification(buttonInfo, id, environment);
                return {
                    type: 'success',
                    status: true,
                    isProduction,
                    message: 'Triggered successfully'
                }
            } catch (error) {
                console.error('Error on trigger', error);
                const data = error.response?.data;
                if (data && data.message) {
                    return {
                        type: 'warning',
                        status: false,
                        message: data.message
                    }
                }
            }
        }
        return {
            type: 'warning',
            status: false,
            message: 'Not Found'
        }
    }
});
