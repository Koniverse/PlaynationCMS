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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'game.rank-definition': GameRankDefinition;
    }
  }
}
