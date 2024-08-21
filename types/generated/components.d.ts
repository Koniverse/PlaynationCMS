import type { Schema, Attribute } from '@strapi/strapi';

export interface AchievementAchievementMetric extends Schema.Component {
  collectionName: 'components_achievement_achievement_metrics';
  info: {
    displayName: 'achievement_metric';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<
      [
        'all:nps',
        'task:nps',
        'task:quantity',
        'referral:nps',
        'referral:quantity',
        'referral:inviteToPlay:nps',
        'referral:inviteToPlay:quantity',
        'game:casual:nps',
        'game:casual:point',
        'game:casual:quantity',
        'game:farming:point',
        'game:farming:totalPoint',
        'game:farming:earnSpeed'
      ]
    > &
      Attribute.Required;
    specialTime: Attribute.Enumeration<['weekly', 'monthly', 'yearly']>;
    startTime: Attribute.DateTime;
    endTime: Attribute.DateTime;
    games: Attribute.Relation<
      'achievement.achievement-metric',
      'oneToMany',
      'api::game.game'
    >;
    tasks: Attribute.Relation<
      'achievement.achievement-metric',
      'oneToMany',
      'api::task.task'
    >;
    metadata: Attribute.JSON;
    metricId: Attribute.Enumeration<['metric-1', 'metric-2', 'metric-3']>;
  };
}

export interface AchievementAchievementMilestone extends Schema.Component {
  collectionName: 'components_achievement_achievement_milestone';
  info: {
    displayName: 'achievement_milestone';
    icon: 'apps';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    nps: Attribute.Integer;
    conditions_combination: Attribute.Enumeration<['and', 'or']> &
      Attribute.Required &
      Attribute.DefaultTo<'and'>;
    conditions: Attribute.Component<'achievement.milestone-condition', true> &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 9;
        },
        number
      >;
  };
}

export interface AchievementMilestoneCondition extends Schema.Component {
  collectionName: 'components_achievement_milestone_conditions';
  info: {
    displayName: 'milestone-condition';
    icon: 'star';
    description: '';
  };
  attributes: {
    metric: Attribute.Enumeration<['metric-1', 'metric-2', 'metric-3']> &
      Attribute.Required &
      Attribute.DefaultTo<'metric-1'>;
    comparison: Attribute.Enumeration<
      [
        'gt',
        'gte',
        'lt',
        'lte',
        'eq',
        'rank_gt',
        'rank_gte',
        'rank_lt',
        'rank_lte',
        'rank_eq'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'gt'>;
    value: Attribute.Float & Attribute.Required & Attribute.DefaultTo<0>;
  };
}

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
        'referral:inviteToPlay:nps',
        'referral:inviteToPlay:quantity',
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
      'achievement.achievement-metric': AchievementAchievementMetric;
      'achievement.achievement-milestone': AchievementAchievementMilestone;
      'achievement.milestone-condition': AchievementMilestoneCondition;
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
