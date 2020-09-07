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
import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
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
      pkce: true,
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
    // TODO: Finish
    // Request to initialize flow
    // https://dev-micah.okta.com/oauth2/default/v1/authorize?client_id=0oapu4btsL2xI0y8y356&
    // redirect_uri=http://localhost:8080/callback&response_type=code&
    // response_mode=fragment&
    // state=MdXrGikS5LACsWs2HZFqS7IC9zMC6F9thOiWDa5gxKRqoMf7bCkTetrrwKw5JIAA&
    // nonce=iAXdcF77sQ2ejthPM5xZtytYUjqZkJTXcHkgdyY2NinFx6y83nKssxEzlBtvnSY2&
    // code_challenge=elU6u5zyqQT2f92GRQUq6PautAeNDf4DQPayyR0ek_c&
    // code_challenge_method=S256&
    // scope=openid profile email

    // Example of callback containing an authorization code (which can be exchange for tokens)
    // http://localhost:8080/callback#
    // code=ZIhxKbQyh-vC32deCWpM&
    // state=MdXrGikS5LACsWs2HZFqS7IC9zMC6F9thOiWDa5gxKRqoMf7bCkTetrrwKw5JIAA
    const providerOptions = {
      ...options,
      accessType: 'offline',
      prompt: 'consent',
    };

    return await executeRedirectStrategy(req, this._strategy, providerOptions);
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    // Request to exchange auth code for tokens
    // https://dev-micah.okta.com/oauth2/ausneyiq5fyDfRMvZ356/v1/token
    // client_id=0oapu4btsL2xI0y8y356&
    // code_verifier=7073d688b6dcb02b9a2332e0792be265b9168fda7a6&
    // redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback&
    // grant_type=authorization_code&
    // code=AyfnwMyCi2S9-op2xToh
    const { response, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResponse,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: response,
      refreshToken: privateInfo.refreshToken,
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
    const pkce: boolean = envConfig.getString('pkce').toLowerCase() === 'true';
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
