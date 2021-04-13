/*
 * Copyright 2021 Spotify AB
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
  Typography,
  Grid,
  Box,
  Paper,
  Card,
  CardContent,
  IconButton,
  Link,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';

import GitHubIcon from '@material-ui/icons/GitHub';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { red, orange, green } from '@material-ui/core/colors';
import PriorityHighSharpIcon from '@material-ui/icons/PriorityHighSharp';
import LayersIcon from '@material-ui/icons/Layers';
import CloudIcon from '@material-ui/icons/Cloud';
import { AWS } from './Aws';
import AddIcon from '@material-ui/icons/Add';

const statuses: any = {
  success: <DoneIcon style={{ color: green[500] }} />,
  fail: <CloseIcon style={{ color: red[500] }} fontSize="small" />,
  alert: (
    <PriorityHighSharpIcon style={{ color: orange[500] }} fontSize="small" />
  ),
};

const capabilities = [
  {
    isMember: true,
    name: 'dfdsdotcom',
    description: 'DFDS.com based on GatsbyJS',
    status1: statuses.success,
  },
  {
    isMember: false,
    name: 'dfdsdotcom-legacy',
    description: 'DFDS.com based on crap tech',
    status1: statuses.success,
  },
  {
    isMember: true,
    name: 'dynamic-forms',
    description: 'dynamic contentful forms',
    status1: statuses.alert,
  },
  {
    isMember: false,
    name: 'cloud-infra',
    description: 'Zaradars lair',
    status1: statuses.alert,
  },
];

const CapabilityCard = ({ name, description, status1, ...props }: any) => {
  const [isMember, setIsMember] = React.useState(props.isMember || false);
  return (
    <Box mb={1}>
      <Card style={isMember ? { borderTop: '3px solid #a95fdf' } : {}}>
        <CardContent>
          <Box display="flex">
            <Box flex={1} display="flex" flexDirection="column">
              <Typography
                variant="h5"
                component={Link}
                href="/dfds-capability-plugin"
                color="textPrimary"
              >
                {name}
              </Typography>
              <Typography variant="caption">{description}</Typography>
            </Box>
            <Box display="flex" alignItems="baseline">
              {isMember ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  style={{ marginRight: 5 }}
                  onClick={() => setIsMember(false)}
                >
                  leave
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginRight: 5 }}
                  onClick={() => setIsMember(true)}
                >
                  join
                </Button>
              )}

              <Tooltip title="open capability repository">
                <GitHubIcon fontSize="small" />
              </Tooltip>
              <Tooltip title="open capability actions menu">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box>
            <Box mb={0.5} ml={4} mr={4} mt={1} display="flex">
              <Box flex={1}>
                <Paper style={{ backgroundColor: '#a95fdf' }}>
                  <Box p={0.5} pr={1} display="flex" alignItems="center">
                    <LayersIcon
                      style={{ marginRight: 5, color: 'white' }}
                      fontSize="small"
                    />
                    <Typography style={{ color: 'white' }}>Status</Typography>
                    <Box flex={1} />
                    <Box>
                      <Typography variant="caption" style={{ color: 'white' }}>
                        updated 2 hours ago
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                style={{ color: 'white' }}
              >
                {status1}
              </Box>
            </Box>
            <Box mb={0.5} ml={4} mr={7} mt={1}>
              <Paper style={{ backgroundColor: '#a95fdf' }}>
                <Box p={0.5} pr={1} display="flex" alignItems="center">
                  <LayersIcon
                    style={{ marginRight: 5, color: 'white' }}
                    fontSize="small"
                  />
                  <Typography style={{ color: 'white' }}>Providers</Typography>
                  <Box flex={1} />
                  <Box display="flex" alignItems="center">
                    <AWS />
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Box mb={0.5} ml={4} mr={7} mt={1}>
              <Paper style={{ backgroundColor: '#a95fdf' }}>
                <Box p={0.5} pr={1} display="flex" alignItems="center">
                  <LayersIcon
                    style={{ marginRight: 5, color: 'white' }}
                    fontSize="small"
                  />
                  <Typography style={{ color: 'white' }}>Services</Typography>
                  <Box flex={1} />
                  <Box display="flex" alignItems="center">
                    <CloudIcon
                      style={{ marginRight: 5, color: 'white' }}
                      fontSize="small"
                    />{' '}
                    <Typography style={{ color: 'white' }}>9</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const ExampleComponent = () => {
  const [search, setSearch] = React.useState('');
  return (
    <Page themeId="tool">
      <Header title="Welcome to dfds-discoverability!">
        <HeaderLabel label="Owner" value="@dfds" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Capabilities">
          <SupportButton>A description of your plugin goes here.</SupportButton>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search for capabilities"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" onClick={() => setSearch('')}>
                  {search && <CloseIcon />}
                </InputAdornment>
              ),
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </ContentHeader>

        <Grid container spacing={3} direction="column">
          <Box mb={1}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Create capability
            </Button>
          </Box>
          {capabilities.map(c => (
            <CapabilityCard {...c} />
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
