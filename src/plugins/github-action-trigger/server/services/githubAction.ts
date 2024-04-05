/**
 * listing service
 */
import axios from 'axios';
import {Strapi} from "@strapi/strapi";
import {GithubActionEnabledResponse, TriggerButtonInfo} from "../../types";

const urlPostTrigger = (owner: string, repo: string, workflow: string) => `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;
const getHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
})

const urlGetWorkflow = (owner: string, repo: string, workflow: string) => `https://github.com/${owner}/${repo}/actions/workflows/${workflow}`;

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
    const githubActions = await strapi.admin.config.githubActions;
    const {triggerButtons} = githubActions;
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
    if (enabled) {
      const {triggerButtons, disabled} = githubActions;
      if (triggerButtons && triggerButtons.hasOwnProperty(apiID) && !disabled) {
        buttons.push(...triggerButtons[apiID]);
      }
      if (disabled) {
        enabled = false;
      }
    }

    return {
      enabled,
      buttons
    } as GithubActionEnabledResponse;
  },
  async trigger(buttonID: string) {
    // @ts-ignore
    const githubActions = await strapi.admin.config.githubActions;
    const {
      triggerButtons,
      githubToken,
      githubOwner,
      githubRepo,
      githubBranch,
      githubWorkflow
    } = githubActions;
    let urlWorkflow = '';
    let executed = false;

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
      let {
        workflow,
        repository,
        branch,
        owner,
        token,
        inputs,
        apiID,
        buttonID
      } = buttonInfo;
      if (!workflow) {
        workflow = githubWorkflow;
      }
      if (!repository) {
        repository = githubRepo;
      }
      if (!branch) {
        branch = githubBranch;
      }
      if (!owner) {
        owner = githubOwner;
      }
      if (!token) {
        token = githubToken;
      }
      const url = urlPostTrigger(owner, repository, workflow);

      try {
        console.log('Trigger Github Action with config', url, branch, inputs);
        const data = await axios.post(url, {
          ref: branch,
          inputs
        }, {headers: getHeaders(token)});
        urlWorkflow = urlGetWorkflow(owner, repository, workflow);
        await strapi.services['api::audit-log.audit-log'].addAuditLogDeploy(buttonInfo);
      } catch (error) {
        console.error('Error on trigger', error);
        const data = error.response?.data;
        if (data && data.message) {
          return {
            executed: false,
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
