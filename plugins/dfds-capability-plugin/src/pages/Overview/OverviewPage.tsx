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
import styled from '@emotion/styled';

import OverviewComponent from '../../components/Overview';
import MembersFetchComponent from '../../components/MembersFetch';
import StatusFetchComponent from '../../components/StatusFetch';
import ButtonComponent from '../../components/shared/Button';
import HeaderComponent from '../../components/shared/Header';

const LeftContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;
  margin: 0;

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewPage: React.FC<{}> = () => {
  const [joinLeaveButton, setJoinLeaveButton] = React.useState<string>('Join');

  const handleClick = () => {
    if (joinLeaveButton === 'Join') {
      setJoinLeaveButton('Leave');
    } else if (joinLeaveButton === 'Leave') {
      setJoinLeaveButton('Join');
    }
  };

  return (
    <React.Fragment>
      <HeaderComponent title="Overview" />
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
    </React.Fragment>
  );
};

export default OverviewPage;
