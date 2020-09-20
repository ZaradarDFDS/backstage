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
import React from 'react';
import { Page, Header, HeaderLabel, pageTheme, Tabs } from '@backstage/core';
import OverviewPage from '../pages/Overview';

const tabs = [
  {
    label: 'Overview',
    content: <OverviewPage />,
  },
  {
    label: 'CI/CD',
    content: 'CI/CD',
  },
  {
    label: 'Kubernetes',
    content: 'Kubernetesss',
  },
  {
    label: 'Cloud',
    content: 'cloudss',
  },
  {
    label: 'Monitoring',
    content: 'monitorings',
  },
  {
    label: 'Costs',
    content: 'cotsss',
  },
];
const App: React.FC<{}> = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
        <HeaderLabel label="Owner" value="DevX" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Tabs
        tabs={tabs.map(tab => ({
          label: tab.label,
          content: tab.content,
        }))}
      />
    </Page>
  );
};

export default App;
