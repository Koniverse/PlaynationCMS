import type { Schema, Attribute } from '@strapi/strapi';

export interface GameLevelDefinition extends Schema.Component {
  collectionName: 'components_game_level_definitions';
  info: {
    displayName: 'Level Definition';
    icon: 'magic';
    description: '';
  };
  attributes: {
    level: Attribute.Integer;
    price: Attribute.Integer;
    maxPointPerGame: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'game.level-definition': GameLevelDefinition;
    }
  }
}
