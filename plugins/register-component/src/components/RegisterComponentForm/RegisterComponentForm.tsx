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

import React, { FC, useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  LinearProgress,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import { ComponentIdValidators } from '../../util/validate';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  form: {
    alignItems: 'flex-start',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  submit: {
    marginTop: theme.spacing(1),
  },
}));

export type Props = {
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  submitting: boolean;
};

const RegisterComponentForm: FC<Props> = ({ onSubmit, submitting }) => {
  const { register, handleSubmit, errors, formState, setValue } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.componentLocation;
  const dirty = formState?.dirty;
  const initialLocationSelection = "github";

  React.useEffect(() => {
    register("locationSelection");
    setValue("locationSelection", initialLocationSelection);
  }, [register]);


  const [locationSelection, setLocationSelection] = useState(initialLocationSelection);

  // Makes sure internal state is updated to reflect changes in UI and react-hook-form receives the new value
  const handleLocationSelectionChange = (event: any) => {
    setLocationSelection(event.target.value);
    setValue("locationSelection", event.target.value);
  };

  return submitting ? (
    <LinearProgress data-testid="loading-progress" />
  ) : (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className={classes.form}
      data-testid="register-form"
    >
      <FormControl>
        <TextField
          id="registerComponentInput"
          variant="outlined"
          label="Component file URL"
          data-testid="componentLocationInput"
          error={hasErrors}
          placeholder="https://example.com/user/some-service/blob/master/component.yaml"
          name="componentLocation"
          required
          margin="normal"
          helperText="Enter the full path to the component.yaml file in GitHub to start tracking your component. It must be in a public repo."
          inputRef={register({
            required: true,
            validate: ComponentIdValidators,
          })}
        />

        {errors.componentLocation && (
          <FormHelperText error={hasErrors} id="register-component-helper-text">
            {errors.componentLocation.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl>
        <InputLabel id="registerComponentLocationSelection-label">Location</InputLabel>
        <Select
          labelId="registerComponentLocationSelection-label"
          id="registerComponentLocationSelection"
          required
          displayEmpty
          name="componentLocationSelection"
          value={locationSelection}
          onChange={handleLocationSelectionChange}
        >
            <MenuItem value={"github"}>GitHub</MenuItem>
            <MenuItem value={"github/api"}>GitHub - Private repos</MenuItem>
            <MenuItem value={"azuredevops"}>Azure DevOps</MenuItem>
          </Select>
      </FormControl>

      <Button
        id="registerComponentFormSubmit"
        variant="contained"
        color="primary"
        type="submit"
        disabled={!dirty || hasErrors}
        className={classes.submit}
      >
        Submit
      </Button>
    </form>
  );
};

export default RegisterComponentForm;
