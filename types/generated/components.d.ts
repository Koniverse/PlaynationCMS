import type { Schema, Attribute } from '@strapi/strapi';

export interface AirdropCampaignShare extends Schema.Component {
  collectionName: 'components_airdrop_campaign_shares';
  info: {
    displayName: 'Share';
    description: '';
  };
  attributes: {
    content: Attribute.Text;
    url_share: Attribute.String;
    hashtags: Attribute.String;
    content_not_show_point: Attribute.Text;
    raffle_content: Attribute.Text;
    raffle_content_not_show_point: Attribute.Text;
    raffle_url_share: Attribute.String;
    raffle_hashtags: Attribute.String;
    url_telegram: Attribute.String;
    url_website: Attribute.String;
    url_twitter: Attribute.String;
    url_discord: Attribute.String;
  };
}

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

export interface LeaderBoardGameParams extends Schema.Component {
  collectionName: 'components_leader_board_game_params';
  info: {
    displayName: 'custom-params';
    icon: 'chartBubble';
    description: '';
  };
  attributes: {
    games: Attribute.Relation<
      'leader-board.game-params',
      'oneToMany',
      'api::game.game'
    >;
    tasks: Attribute.Relation<
      'leader-board.game-params',
      'oneToMany',
      'api::task.task'
    >;
  };
}

export interface LeaderBoardLbGeneral extends Schema.Component {
  collectionName: 'components_leader_board_lb_generals';
  info: {
    displayName: 'general-params';
    icon: 'earth';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.String;
    type: Attribute.Enumeration<
      [
        'all:nps',
        'task:nps',
        'task:quantity',
        'referral:nps',
        'referral:quantity',
        'game:casual:nps',
        'game:casual:point',
        'game:casual:quantity',
        'game:farming:point',
        'game:farming:totalPoint',
        'game:farming:earnSpeed'
      ]
    >;
    specialTime: Attribute.Enumeration<['weekly', 'monthly', 'yearly']>;
    startTime: Attribute.DateTime;
    endTime: Attribute.DateTime;
    metedata: Attribute.JSON;
  };
}

export interface LeaderBoardXSharing extends Schema.Component {
  collectionName: 'components_leader_board_x_sharings';
  info: {
    displayName: 'x-sharing';
    icon: 'chartBubble';
  };
  attributes: {
    url: Attribute.String;
    content: Attribute.Text;
    hashtags: Attribute.String;
  };
}

export interface TaskAchievement extends Schema.Component {
  collectionName: 'components_task_achievements';
  info: {
    displayName: 'Achievement';
    description: '';
  };
  attributes: {
    from_date: Attribute.DateTime;
    to_date: Attribute.DateTime;
    value: Attribute.Integer;
    type: Attribute.Enumeration<['game_count', 'game_point', 'referral_count']>;
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
      'airdrop-campaign.share': AirdropCampaignShare;
      'game.rank-definition': GameRankDefinition;
      'leader-board.game-params': LeaderBoardGameParams;
      'leader-board.lb-general': LeaderBoardLbGeneral;
      'leader-board.x-sharing': LeaderBoardXSharing;
      'task.achievement': TaskAchievement;
      'task.content-share': TaskContentShare;
      'telegram.inline-keyboard': TelegramInlineKeyboard;
    }
  }
}
