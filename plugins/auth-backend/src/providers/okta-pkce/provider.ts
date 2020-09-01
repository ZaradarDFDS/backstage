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
import { Logger } from 'winston';
import express from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import { Config } from '@backstage/config';
import { TokenIssuer } from '../../identity';
import { OAuthProvider } from '../../lib/OAuthProvider';
import {
  OAuthProviderHandlers,
  RedirectInfo,
  AuthProviderConfig,
  OAuthProviderOptions,
  OAuthRequest,
  OAuthResponse,
  PassportDoneCallback,
} from '../types';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  executeFetchUserProfileStrategy,
} from '../../lib/PassportStrategyHelper';

type PrivateInfo = {
  refreshToken: string;
};

export type OktaAuthProviderOptions = OAuthProviderOptions & {
  audience: string;
};

export class OktaAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: any;

  constructor(options: OktaAuthProviderOptions) {
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

  async start(req: OAuthRequest): Promise<RedirectInfo> {
    const providerOptions = {
      ...req?.options,
      accessType: 'offline',
      prompt: 'consent',
    };

    return await executeRedirectStrategy(
      req as express.Request,
      this._strategy,
      providerOptions,
    );
  }

  async handle(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { response, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResponse,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.populateIdentity(response),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRequest): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      req?.refreshToken as string,
      req?.scope as string,
    );

    const profile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
      params.id_token,
    );

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile?.email) {
      throw new Error('Okta profile contained no email');
    }

    // TODO(Rugvip): Hardcoded to the local part of the email for now
    const id = profile.email.split('@')[0];

    return { ...response, identity: { id } };
  }
}

export function createProvider(
  config: AuthProviderConfig,
  _: string,
  envConfig: Config,
  _logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const providerId = 'okta';
  const clientId = envConfig.getString('clientId');
  const clientSecret = envConfig.getString('clientSecret');
  const audience = envConfig.getString('audience');
  const callbackUrl = `${config.baseUrl}/${providerId}/handle/frame`;
  const pkce: boolean = JSON.parse(envConfig.getString('pkce'));

  const provider = new OktaAuthProvider({
    audience,
    clientId,
    clientSecret,
    callbackUrl,
    pkce,
  });

  return OAuthProvider.fromConfig(config, provider, {
    disableRefresh: false,
    providerId,
    tokenIssuer,
  });
}
