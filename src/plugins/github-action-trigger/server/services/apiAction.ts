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

export default ({ strapi }: { strapi: Strapi }) => ({
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
          }}
      },
      populate: ['role'],
    });
    // @ts-ignore
    return permissionList && permissionList.reduce((currentValue,permission) => {
      const actionSplit = permission.action.split('.');
      if (actionSplit.length > 0) {
        currentValue.push(actionSplit[actionSplit.length - 1]);
      }
      return currentValue;
    }, []);
  },
  async getButtons(apiID: string) {
    // @ts-ignore
    const apiActions = await strapi.admin.config.apiActions;
    console.log('apiActions', apiActions)
    const {triggerButtons} = apiActions;
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

    return {
      enabled,
      buttons
    } as GithubActionEnabledResponse;
  },
  async trigger(buttonID: string) {
    // @ts-ignore
    const apiActions = await strapi.admin.config.apiActions;
    const {triggerButtons, apiToken, apiActionUrl} = apiActions;
    let urlWorkflow = '';
    let executed = false;
    console.log('triggerButtons', triggerButtons)
    console.log('buttonID', buttonID)

    const buttonInfo = triggerButtons.find((button) => button.buttonID === buttonID);
    const {enabled} = await this.getButtons(buttonInfo.apiID);
    if (!enabled) {
      return {
        executed,
        urlWorkflow
      }
    }

    if (buttonInfo) {
      executed = true;
      console.log('buttonInfo', buttonInfo);
      const {singularName, routerApi} = buttonInfo;
      // const url = urlPostTrigger(owner, repository, workflow);
      const generalParams = {
        publicationState: 'preview' ,
        locale: 'en'
      }
      const contentSend = await strapi.service(singularName).customList(generalParams)
      try {
        const url = `${apiActionUrl}${routerApi}`;
        const data = await axios.post(url, {
          data: contentSend
        }, {headers: getHeaders(apiToken)});
        console.log('data', data)
        // await strapi.services['api::audit-log.audit-log'].addAuditLogDeploy(buttonInfo);
        return {
            type: 'success',
          status: true,
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
      executed,
      urlWorkflow
    }
  }
});
