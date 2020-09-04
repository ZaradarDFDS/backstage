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
import express from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
} from '../../lib/oauth';
import { PassportDoneCallback } from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export type OktaPkceAuthProviderOptions = OAuthProviderOptions & {
  audience: string;
  pkce: boolean;
};

export class OktaPkceAuthProvider implements OAuthHandlers {
  private readonly _strategy: any;

  constructor(options: OktaPkceAuthProviderOptions) {
    const oAuthOptions: OAuth2Strategy.StrategyOptions = {
      authorizationURL: `https://dfds-devex.okta.com/oauth2/${options.audience}/v1/authorize`,
      tokenURL: `https://dfds-devex.okta.com/oauth2/${options.audience}/v1/token`,
      state: true,
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      pkce: options.pkce,
      callbackURL: options.callbackUrl,
    };

    const verifyFunction: OAuth2Strategy.VerifyFunction = (
      accessToken: any,
      refreshToken: any,
      params: any,
      rawProfile: passport.Profile,
      done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
    ) => {
      console.log('token', accessToken, refreshToken);
      console.log('params', params);
      console.log('profile', rawProfile);

      done();
    };

    this._strategy = new OAuth2Strategy(oAuthOptions, verifyFunction);
  }

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    console.log('Starting request', req, options);
    // TODO: Finish

    return { url: '', status: 200 };
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    console.log('Handling request', req);
    // TODO: Finish
    return {
      response: {
        providerInfo: { accessToken: '', scope: '' },
        profile: {},
      },
      refreshToken: '',
    };
  }

  async refresh(refreshToken: string, scope: string): Promise<OAuthResponse> {
    console.log('Refresh request', refreshToken, scope);
    // TODO: Finish

    return {
      providerInfo: { accessToken: '', scope: '' },
      profile: {},
    };
  }
}

export const createOktaPkceProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const providerId = 'okta-pkce';
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const audience = envConfig.getString('audience');
    const pkce = envConfig.getBoolean('pkce');
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

    const provider = new OktaPkceAuthProvider({
      pkce,
      audience,
      clientId,
      clientSecret,
      callbackUrl,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: true,
      providerId,
      tokenIssuer,
    });
  });
