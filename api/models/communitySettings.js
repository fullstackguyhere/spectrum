// @flow
const { db } = require('./db');
import type { DBCommunitySettings } from 'shared/types';
import { getCommunityById } from './community';

const defaultSettings = {
  brandedLogin: {
    isEnabled: false,
    message: null,
  },
};

export const getCommunitySettings = (id: string) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return defaultSettings;
      }
      return data[0];
    });
};

export const getCommunitiesSettings = (
  communityIds: Array<string>
): Promise<?DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(...communityIds, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return Array.from({ length: communityIds.length }, (_, index) => ({
          ...defaultSettings,
          communityId: communityIds[index],
        }));
      }

      if (data.length === communityIds.length) {
        return data.map(
          (rec, index) =>
            rec
              ? rec
              : {
                  ...defaultSettings,
                  communityId: communityIds[index],
                }
        );
      }

      if (data.length < communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId);
          if (record) return record;
          return {
            ...defaultSettings,
            communityId,
          };
        });
      }

      if (data.length > communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId);
          if (record) return record;
          return {
            ...defaultSettings,
            communityId,
          };
        });
      }
    });
};

export const createCommunitySettings = (id: string) => {
  return db
    .table('communitySettings')
    .insert({
      communityId: id,
      brandedLogin: {
        isEnabled: false,
        message: null,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const enableCommunityBrandedLogin = (id: string) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: true,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const disableCommunityBrandedLogin = (id: string) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: false,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const updateCommunityBrandedLoginMessage = (
  id: string,
  message: ?string
) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        message: message,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};
