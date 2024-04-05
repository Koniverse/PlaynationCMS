import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import TriggerGithubAction from './components/TriggerGithubAction';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.injectContentManagerComponent('listView', 'actions', { name: 'trigger-github-action', Component: TriggerGithubAction});
  },

  bootstrap(app: any) {}
};
