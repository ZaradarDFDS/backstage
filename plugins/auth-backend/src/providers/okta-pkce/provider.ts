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
import axios from 'axios';
import cryptoJs from 'crypto-js';
import { v4 as generateUuidv4 } from 'uuid';
import generateNonce from 'nonce';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
} from '../../lib/oauth';
import { RedirectInfo, AuthProviderFactory } from '../types';

export type OktaPkceAuthProviderOptions = OAuthProviderOptions & {
  audience: string;
  pkce: boolean;
};

export const generateRandomString = (
  numberOfChars: number,
  seed: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string => {
  let text: string = '';

  for (let i = 0; i < numberOfChars; i++)
    text += seed.charAt(Math.floor(Math.random() * seed.length));

  return text;
};

export class OktaPkceAuthProvider implements OAuthHandlers {
  private readonly _options: OktaPkceAuthProviderOptions;

  constructor(options: OktaPkceAuthProviderOptions) {
    this._options = options;
  }

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    if (!req.session) {
      throw new Error('Provider requires express-session!');
    }

    console.log(
      'Fuck you Husky for making me do this so I can commit my code.',
      options,
    );

    const scopes = 'openid profile email';
    const correlationId = generateUuidv4();
    const nonce = generateNonce();
    const codeVerifier = generateRandomString(43);
    const codeChallenge = cryptoJs.Base64.stringify(
      cryptoJs.sha256(nonce + codeVerifier),
    );

    req.session.codeChallenge = codeChallenge;
    req.session.codeVerifier = codeVerifier;
    req.session.correlationId = correlationId;
    req.session.scopes = scopes;
    req.session.save((err: any) => {
      console.log(err);
    });

    const authorizeResponse = await axios.get(
      `https://dfds-devex-admin.okta.com/oauth2/default/v1/authorize?client_id=${this._options.clientId}&redirect_uri=${this._options.callbackUrl}&response_type=code&response_mode=fragment&state=${correlationId}&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scopes}`,
    );

    // TODO: Figure out what this URL should be?
    const result: RedirectInfo = { url: '', status: authorizeResponse.status };

    return new Promise(resolve => {
      resolve(result);
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    if (req.query.state !== req.session?.correlationId) {
      throw new Error(
        `State: ${req.query.state} does not match correlationId: ${req.session?.correlationId}!`,
      );
    }

    const tokenRequest = await axios.get(
      `https://dfds-devex-admin.okta.com/oauth2/default/v1/token?client_id=${this._options.clientId}code_verifier=${req.session?.codeVerifier}&redirect_uri=${this._options.callbackUrl}&grant_type=authorization_code&code=${req.query.code}`,
    );
    const payload = JSON.parse(tokenRequest.data);

    // TODO: Figure out what the profile is supposed to be?
    // TODO: This is NOT the right token. Figure out if we can us it to acquire a refresh token.
    const result: { response: OAuthResponse; refreshToken: string } = {
      response: {
        providerInfo: {
          accessToken: payload.accessToken,
          scope: payload.scope,
        },
        profile: {},
      },
      refreshToken: payload.id_token,
    };

    return new Promise(resolve => {
      resolve(result);
    });
  }

  // TODO: Figure out if this can be done.
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
