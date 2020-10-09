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
import React, { FC } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { Tooltip } from '@material-ui/core';
import { StatusColor } from '../styles';
import { css, cx } from 'emotion';
import { useAsync } from 'react-use';

type DenseTableProps = {
  dataSource: any[];
};

export const DenseTable: FC<DenseTableProps> = props => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Kind', field: 'kind' },
    { title: 'Cluster', field: 'cluster' },
    { title: 'Node', field: 'node' },
    { title: 'Status', field: 'status' },
    { title: 'Comment', field: 'comment' },
  ];

  const sizes = css`
    width: 1.5rem;
    height: 1.5rem;
  `;

  const memberData = props.dataSource.map(entry => {
    const status = () => {
      if (entry.dob.age < 45) {
        return (
          <Tooltip title={entry.nat}>
            <StatusColor
              className={cx(sizes)}
              style={{ backgroundColor: 'rgb(20, 177, 171)' }} // green
            />
          </Tooltip>
        );
      } else if (entry.dob.age < 65) {
        return (
          <Tooltip title={entry.nat}>
            <StatusColor
              className={cx(sizes)}
              style={{ backgroundColor: 'rgb(249, 213, 110)' }} // yellow
            />
          </Tooltip>
        );
      }
      return (
        <Tooltip title={entry.nat}>
          <StatusColor
            className={cx(sizes)}
            style={{ backgroundColor: 'rgb(232, 80, 91)' }} // red
          />
        </Tooltip>
      );
    };

    return {
      name: `${entry.name.first}`,
      kind: `${entry.name.first} ${entry.name.last}`,
      cluster: `${entry.name.first} ${entry.name.last} ${entry.nat}`,
      node: `${entry.dob.age}`,
      status: status(),
      comment: `${entry.registered.date}`,
    };
  });

  return (
    <Table
      title="Kubernetes"
      options={{ search: false, paging: true, pageSize: 10 }}
      columns={columns}
      data={memberData}
    />
  );
};

const K8sFetchComponent: FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch('https://randomuser.me/api/?results=20');
    const data = await response.json();
    return data.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable dataSource={value || []} />;
};

export default K8sFetchComponent;
