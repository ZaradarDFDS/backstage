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
import {
  Page,
  Content,
  Header,
  HeaderLabel,
  pageTheme,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import OverviewComponent from '../../components/OverviewComponent';
import MembersFetchComponent from '../../components/MembersFetchComponent';
import StatusFetchComponent from '../../components/StatusFetchComponent';
import ButtonComponent from '../../components/ButtonComponent';
import styled from '@emotion/styled';

const LeftContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;
`;

const OverviewPage: React.FC<{}> = () => {
  const [joinLeaveButton, setJoinLeaveButton] = React.useState('Join');
  const handleClick = () => {
    if (joinLeaveButton === 'Join') {
      setJoinLeaveButton('Leave');
    } else if (joinLeaveButton === 'Leave') {
      setJoinLeaveButton('Join');
    }
  };
  return (
    <Page theme={pageTheme.tool}>
      <Header title="Welcome to the Capability plugin!" subtitle="@DFDS-SSU">
        <HeaderLabel label="Owner" value="DevX" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Overview">
          <SupportButton>Capability cockpit v. 1</SupportButton>
        </ContentHeader>
        <Container>
          <LeftContainer>
            <OverviewComponent />
            <MembersFetchComponent />
            <ButtonComponent onClick={handleClick}>
              {joinLeaveButton}
            </ButtonComponent>
          </LeftContainer>
          <StatusFetchComponent />
        </Container>
      </Content>
    </Page>
  );
};

export default OverviewPage;
