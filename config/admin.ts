import triggerButtons from './data/triggerButtons.json';
import triggerApiButtons from './data/triggerApiButtons.json';
import triggerTelegramButtons from './data/triggerTelegramButtons.json';
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  githubActions: {
    disabled: env.bool('DISABLE_GITHUB_ACTION', false),
    githubToken: env('GITHUB_CONTENT_TOKEN'),
    githubOwner: env('GITHUB_CONTENT_OWNER'),
    githubRepo: env('GITHUB_CONTENT_REPO'),
    githubBranch: env('GITHUB_CONTENT_BRANCH'),
    githubWorkflow: env('GITHUB_CONTENT_WORKFLOW'),
    triggerButtons,
  },
  apiActions: {
    triggerButtons: triggerApiButtons,
    apiActionUrl: env('API_ACTION_URL'),
    apiActionDevelopmentUrl: env('API_ACTION_DEVELOPMENT_URL'),
    apiToken: env('API_TOKEN'),
  },
  telegramActions: {
    triggerButtons: triggerTelegramButtons,
    apiActionUrl: env('API_ACTION_URL'),
    apiActionDevelopmentUrl: env('API_ACTION_DEVELOPMENT_URL'),
    apiToken: env('API_TOKEN'),
    botUrl: env('TELEGRAM_BOT_URL'),
    botDevelopmentUrl: env('TELEGRAM_BOT_DEVELOPMENT_URL'),
  }
});
