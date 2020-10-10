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
import { Tooltip, Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core';
import styled from '@emotion/styled';
import { data } from '../../data.json';
import { StatusColor } from '../styles';

const StatusColorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  margin-bottom: 2rem;
`;

const MessageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  padding: 0.5rem;
`;

const StatusFetchComponent: React.FC<{}> = () => {
  return (
    <InfoCard title="Status">
      <Wrapper>
        <StatusColorContainer>
          {Object.entries(data).map(item => (
            <Tooltip key={item[1].id} title={item[1].tooltip}>
              <StatusColor
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: `${
                    item[1].statusOn
                      ? item[1].statusColorOn
                      : item[1].statusColorOff
                  }`,
                }}
              />
            </Tooltip>
          ))}
        </StatusColorContainer>
        {Object.entries(data).map(
          item =>
            item[1].statusOn && (
              <Typography variant="h4" key={item[1].id}>
                {item[1].title}
              </Typography>
            ),
        )}
        {Object.entries(data).map(
          item =>
            item[1].statusOn && (
              <MessageContainer key={item[1].id}>
                {item[1].message}
              </MessageContainer>
            ),
        )}
      </Wrapper>
    </InfoCard>
  );
};

export default StatusFetchComponent;
