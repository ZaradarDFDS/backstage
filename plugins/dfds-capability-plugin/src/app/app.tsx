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
import styled from '@emotion/styled';

import OverviewPage from '../pages/Overview';
import CICDPage from '../pages/CICD';
import KubernetesPage from '../pages/Kubernetes';
import CloudPage from '../pages/Cloud';
import MonitoringPage from '../pages/Monitoring';
import CostsPage from '../pages/Costs';

const tabs = [
  {
    label: 'Overview',
    content: <OverviewPage />,
  },
  {
    label: 'CI/CD',
    content: <CICDPage />,
  },
  {
    label: 'Kubernetes',
    content: <KubernetesPage />,
  },
  {
    label: 'Cloud',
    content: <CloudPage />,
  },
  {
    label: 'Monitoring',
    content: <MonitoringPage />,
  },
  {
    label: 'Costs',
    content: <CostsPage />,
  },
];

const StyledTabsContainer = styled.div`
  width: calc(100vw - 4.5rem);
`;

const App: React.FC<{}> = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
        <HeaderLabel label="Owner" value="DevX" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <StyledTabsContainer>
        <Tabs
          tabs={tabs.map(tab => ({
            label: tab.label,
            content: tab.content,
          }))}
        />
      </StyledTabsContainer>
    </Page>
  );
};

export default App;
