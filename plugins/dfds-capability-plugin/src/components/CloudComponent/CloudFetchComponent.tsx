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
import { useAsync } from 'react-use';

type DenseTableProps = {
  dataSource: any[];
};

export const DenseTable: FC<DenseTableProps> = props => {
  const columns: TableColumn[] = [
    { title: 'S3 bucket', field: 's3Bucket' },
    { title: 'IAM accounts', field: 'IAMAccounts' },
    { title: 'RDS`er', field: 'rdser' },
    { title: 'Cloud Watch', field: 'cloudWatch' },
    { title: 'Topics', field: 'topics' },
    { title: 'Communication Channels', field: 'communication' },
  ];

  const cloudData = props.dataSource.map(entry => {
    return {
      s3Bucket: `${entry.location.state}`,
      IAMAccounts: `${entry.email}`,
      rdser: `${entry.location.street.name}`,
      cloudWatch: `${entry.phone}`,
      topics: `${entry.nat}`,
      communication: `${entry.login.uuid}`,
    };
  });

  return (
    <Table
      title="Cloud"
      options={{ search: true, paging: true, pageSize: 10 }}
      columns={columns}
      data={cloudData}
    />
  );
};

const CloudFetchComponent: FC<{}> = () => {
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

export default CloudFetchComponent;
