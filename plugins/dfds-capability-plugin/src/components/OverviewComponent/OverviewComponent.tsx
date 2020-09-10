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
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import MembersFetchComponent from '../MembersFetchComponent';

const OverviewComponent: FC<{}> = () => (
  <Page theme={pageTheme.tool}>
    <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
      <HeaderLabel label="Owner" value="DevX" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Overview">
        <SupportButton>Capability cockpit v. 1</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              Capability id: foobar
              <br />
              AWS account id: foobar
              <br />
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item>
          <MembersFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);

export default OverviewComponent;
