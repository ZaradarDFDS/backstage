/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { Table, TableColumn, TableProps } from '@backstage/core';
import { appThemeApiRef, useApi } from '@backstage/core-api';
import { Link } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import GitHub from '@material-ui/icons/GitHub';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useObservable } from 'react-use';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { findLocationForEntityMeta } from '../../data/utils';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import { entityRoute } from '../../routes';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '../FavouriteEntity/FavouriteEntity';
import AzureDevOpsIcon from './Icons/AzureDevOpsIcon';

const columns: TableColumn<Entity>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: (entity: any) => (
      <Link
        component={RouterLink}
        to={generatePath(entityRoute.path, {
          optionalNamespaceAndName: [
            entity.metadata.namespace,
            entity.metadata.name,
          ]
            .filter(Boolean)
            .join(':'),
          kind: entity.kind,
        })}
      >
        {entity.metadata.name}
      </Link>
    ),
  },
  {
    title: 'Owner',
    field: 'spec.owner',
  },
  {
    title: 'Lifecycle',
    field: 'spec.lifecycle',
  },
  {
    title: 'Description',
    field: 'metadata.description',
  },
];

type CatalogTableProps = {
  entities: Entity[];
  titlePreamble: string;
  loading: boolean;
  error?: any;
};

export const CatalogTable = ({
  entities,
  loading,
  error,
  titlePreamble,
}: CatalogTableProps) => {
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching catalog entities. {error.toString()}
        </Alert>
      </div>
    );
  }

  let azureDevOpsIconColour = '#d7d5d5';
  let githubPrivateColour = '#d7d5d5';
  let githubPublicColour = '#d7d5d5';

  switch (themeId) {
    case 'dark':
      azureDevOpsIconColour = '#ffffff';
      githubPrivateColour = '#F8F8F8';
      githubPublicColour = '#1DB954';
      break;
    case 'light':
      azureDevOpsIconColour = '#000000';
      githubPrivateColour = '#616161';
      githubPublicColour = '#1DB954';
      break;
    default:
      break;
  }

  const actions: TableProps<Entity>['actions'] = [
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <GitHub fontSize="small" htmlColor={githubPublicColour} />,
        tooltip: '🔓 View on GitHub',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location?.type === 'github' ? false : true,
      };
    },
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <GitHub fontSize="small" htmlColor={githubPrivateColour} />,
        tooltip: '🔒 View on GitHub',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location?.type === 'github/api' ? false : true,
      };
    },
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <AzureDevOpsIcon colour={azureDevOpsIconColour} />,
        tooltip: 'View on Azure DevOps',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location?.type === 'azuredevops' ? false : true,
      };
    },
    (rowData: Entity) => {
      const createEditLink = (location: LocationSpec): string => {
        switch (location.type) {
          case 'github':
            return location.target.replace('/blob/', '/edit/');
          case 'github/api':
            return location.target.replace('/blob/', '/edit/');
          default:
            return location.target;
        }
      };
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <Edit fontSize="small" />,
        tooltip: 'Edit',
        onClick: () => {
          if (!location) return;
          window.open(createEditLink(location), '_blank');
        },
        hidden:
          location?.type === 'github' || location?.type === 'github/api'
            ? false
            : true,
      };
    },
    (rowData: Entity) => {
      const isStarred = isStarredEntity(rowData);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favouriteEntityIcon(isStarred),
        tooltip: favouriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(rowData),
      };
    },
  ];

  return (
    <Table<Entity>
      isLoading={loading}
      columns={columns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
      }}
      title={`${titlePreamble} (${(entities && entities.length) || 0})`}
      data={entities}
      actions={actions}
    />
  );
};
