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
  PieChart,
  Pie,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { InfoCard } from '@backstage/core';
import { Typography } from '@material-ui/core';
import { chart, line } from '../../data.json';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
  }
`;

const PerformanceFetchComponent: React.FC<{}> = () => {
  const totalNameSpace = '(total/namespace)';
  return (
    <InfoCard title="Performance">
      <Wrapper>
        <div>
          <Typography variant="body1">CPU {totalNameSpace}</Typography>
          <LineChart width={400} height={250} data={line}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>
        <div>
          <Typography variant="body1">Memory {totalNameSpace}</Typography>
          <PieChart width={400} height={200}>
            <Pie
              data={chart}
              nameKey="name"
              dataKey="value"
              outerRadius={100}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <Typography variant="body1">Disk IO {totalNameSpace}</Typography>
          <BarChart width={400} height={250} data={line}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </div>
        <div>
          <Typography variant="body1">Network IO {totalNameSpace}</Typography>
          <LineChart width={400} height={250} data={line}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>
      </Wrapper>
    </InfoCard>
  );
};

export default PerformanceFetchComponent;
