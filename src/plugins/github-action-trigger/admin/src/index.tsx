import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import TriggerGithubAction from './components/TriggerGithubAction';
import TriggerApiAction from "./components/TriggerApiAction";

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.injectContentManagerComponent('listView', 'actions', { name: 'trigger-github-action', Component: TriggerGithubAction});
    app.injectContentManagerComponent('listView', 'actions', { name: 'trigger-api-action', Component: TriggerApiAction});
  },

  bootstrap(app: any) {}
};
