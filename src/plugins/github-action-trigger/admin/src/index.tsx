import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import TriggerGithubAction from './components/TriggerGithubAction';
import TriggerApiAction from "./components/TriggerApiAction";
import TelegramSendAction from "./components/TelegramSendAction";

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.injectContentManagerComponent('listView', 'actions', { name: 'trigger-github-action', Component: TriggerGithubAction});
    app.injectContentManagerComponent('listView', 'actions', { name: 'trigger-api-action', Component: TriggerApiAction});
    app.injectContentManagerComponent('editView', 'right-links', { name: 'trigger-telegram-action', Component: TelegramSendAction});
  },

  bootstrap(app: any) {}
};
