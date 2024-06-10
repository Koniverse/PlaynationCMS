import type { Schema, Attribute } from '@strapi/strapi';

export interface GameRankDefinition extends Schema.Component {
  collectionName: 'components_game_rank_definitions';
  info: {
    displayName: 'Rank Definition';
  };
  attributes: {
    point: Attribute.Integer;
    days: Attribute.Integer;
    premium_ref: Attribute.String;
    ref: Attribute.String;
  };
}

export interface TaskContentShare extends Schema.Component {
  collectionName: 'components_task_content_shares';
  info: {
    displayName: 'Content Share';
    description: '';
  };
  attributes: {
    content: Attribute.Text & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    start_time: Attribute.DateTime & Attribute.Required;
    end_time: Attribute.DateTime & Attribute.Required;
    content_no_template: Attribute.Text & Attribute.Required;
  };
}

export interface TelegramInlineKeyboard extends Schema.Component {
  collectionName: 'components_telegram_inline_keyboards';
  info: {
    displayName: 'Inline Keyboard';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    screen: Attribute.Enumeration<
      [
        '/home/mission',
        '/home/games',
        '/home/leaderboard',
        '/home/tokens',
        '/home/airdrop',
        '/home/invite'
      ]
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'game.rank-definition': GameRankDefinition;
      'task.content-share': TaskContentShare;
      'telegram.inline-keyboard': TelegramInlineKeyboard;
    }
  }
}
