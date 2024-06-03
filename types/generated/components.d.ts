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

export interface TelegramInlineKeyboard extends Schema.Component {
  collectionName: 'components_telegram_inline_keyboards';
  info: {
    displayName: 'Inline Keyboard';
    description: '';
  };
  attributes: {
    text: Attribute.String;
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
      'telegram.inline-keyboard': TelegramInlineKeyboard;
    }
  }
}
