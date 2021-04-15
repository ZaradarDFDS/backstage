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
  Menu,
  MenuItem,
  Dialog,
  Toolbar,
  AppBar,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const RepositoryIcon = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="open capability repository">
        <IconButton onClick={handleClick} size="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="22px"
            viewBox="0 0 97 97"
            enableBackground="new 0 0 97 97"
            xmlSpace="preserve"
          >
            <g>
              <path
                fill="#F05133"
                d="M92.71,44.408L52.591,4.291c-2.31-2.311-6.057-2.311-8.369,0l-8.33,8.332L46.459,23.19   c2.456-0.83,5.272-0.273,7.229,1.685c1.969,1.97,2.521,4.81,1.67,7.275l10.186,10.185c2.465-0.85,5.307-0.3,7.275,1.671   c2.75,2.75,2.75,7.206,0,9.958c-2.752,2.751-7.208,2.751-9.961,0c-2.068-2.07-2.58-5.11-1.531-7.658l-9.5-9.499v24.997   c0.67,0.332,1.303,0.774,1.861,1.332c2.75,2.75,2.75,7.206,0,9.959c-2.75,2.749-7.209,2.749-9.957,0c-2.75-2.754-2.75-7.21,0-9.959   c0.68-0.679,1.467-1.193,2.307-1.537V36.369c-0.84-0.344-1.625-0.853-2.307-1.537c-2.083-2.082-2.584-5.14-1.516-7.698   L31.798,16.715L4.288,44.222c-2.311,2.313-2.311,6.06,0,8.371l40.121,40.118c2.31,2.311,6.056,2.311,8.369,0L92.71,52.779   C95.021,50.468,95.021,46.719,92.71,44.408z"
              />
            </g>
          </svg>
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link href="https://github.com/dfds-frontend/dotcom" target="blank">
            https://github.com/dfds-frontend/dotcom
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="https://github.com/dfds-frontend/dotcom" target="blank">
            https://github.com/dfds-frontend/dotcom
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="https://github.com/dfds-frontend/dotcom" target="blank">
            https://github.com/dfds-frontend/dotcom
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

const CapabilityCard = ({ name, description, status1, ...props }: any) => {
  const [isMember, setIsMember] = React.useState(props.isMember || false);

  return (
    <Box mb={1}>
      <Card style={isMember ? { borderTop: '3px solid #345370' } : {}}>
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
              <Box display="flex" alignItems="center">
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
                <RepositoryIcon />
                <Tooltip title="open capability actions menu">
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box mb={0.5} ml={4} mr={4} mt={1} display="flex">
              <Box flex={1}>
                <Paper style={{ backgroundColor: '#345370' }}>
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
              <Paper style={{ backgroundColor: '#345370' }}>
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
              <Paper style={{ backgroundColor: '#345370' }}>
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
  const [open, setOpen] = React.useState(false);
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Create capability
            </Button>
            <Dialog open={open} maxWidth="sm" onClose={() => setOpen(false)}>
              <DialogTitle>Create Capability</DialogTitle>
              <DialogContent>
                <Typography paragraph>
                  The software architect for your area should be consulted when
                  naming capabilities. <br />
                  <br />
                  A capability should be named after the business capability
                  your system will facilitate. e.g. FreightQuotes-Calculation,
                  Handle-frozen-goods, Track-freight.
                  <br />
                  <br />
                  Read more about naming Capabilities in our Playbooks.
                </Typography>
                <Box display="flex" flexDirection="column">
                  <TextField
                    variant="outlined"
                    label="Name"
                    style={{ marginBottom: 5 }}
                    helperText="Only alphanumeric ASCII characters, minimum length of 3 and a maximum of 255. Must start with a capital letter, may contain hyphens."
                  />
                  <TextField variant="outlined" label="Description" />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(false)}
                >
                  Save
                </Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>
          {capabilities.map(c => (
            <CapabilityCard {...c} />
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
