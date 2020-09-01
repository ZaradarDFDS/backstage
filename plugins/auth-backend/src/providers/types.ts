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
import { Logger } from 'winston';
import { TokenIssuer } from '../identity';
import { Config } from '@backstage/config';

/**
 * Auth identify.
 */
export type AuthIdentity = {
  /**
   * The backstage user ID.
   */
  id: string;
};

/**
 * AuthProvider response.
 */
export type AuthResponse<ProviderInfo> = Partial<express.Response> & {
  providerInfo: ProviderInfo;
  profile?: ProfileInfo;
  identity?: AuthIdentity | BackstageIdentity;
};

/**
 * AuthProvider config.
 */
export type AuthProviderConfig = {
  /**
   * The protocol://domain[:port] where the app is hosted. This is used to construct the
   * callbackURL to redirect to once the user signs in to the auth provider.
   */
  baseUrl: string;

  /**
   * The base URL of the app as provided by app.baseUrl
   */
  appUrl: string;
};

/**
 * AuthProvider.
 */
export type AuthProvider = {
  // config: AuthProviderConfig,
  // handler: AuthProviderHandler,
};

/**
 * AuthProviderFactory.
 */
export type AuthProviderFactory = (
  globalConfig: AuthProviderConfig,
  env: string,
  envConfig: Config,
  logger: Logger,
  issuer: TokenIssuer,
) => AuthProvider | undefined;

/**
 * AuthProvider handler.
 */
export interface AuthProviderHandler extends AuthProvider {
  /**
   * Handles the start route of the API. This initiates a sign in request with an auth provider.
   *
   * Request
   * - scopes for the auth request (Optional)
   * Response
   * - redirect to the auth provider for the user to sign in or consent.
   * - sets a nonce cookie and also pass the nonce as 'state' query parameter in the redirect request
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  start(
    req: Partial<express.Request>,
    res?: Partial<express.Response>,
  ): Promise<void> | Promise<any>;

  /**
   * Once the user signs in or consents in the OAuth screen, the auth provider redirects to the
   * callbackURL which is handled by this method.
   *
   * Request
   * - to contain a nonce cookie and a 'state' query parameter
   * Response
   * - postMessage to the window with a payload that contains accessToken, expiryInSeconds?, idToken? and scope.
   * - sets a refresh token cookie if the auth provider supports refresh tokens
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  handle(
    req: Partial<express.Request>,
    res?: Partial<express.Response>,
  ): Promise<void> | Promise<any>;

  /**
   * (Optional) If the auth provider supports refresh tokens then this method handles
   * requests to get a new access token.
   *
   * Request
   * - to contain a refresh token cookie and scope (Optional) query parameter.
   * Response
   * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  refresh?(
    req: Partial<express.Request>,
    res?: Partial<express.Response>,
  ): Promise<void> | Promise<any>;

  /**
   * (Optional) Handles sign out requests
   *
   * Response
   * - removes the refresh token cookie
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  logout?(
    req?: Partial<express.Request>,
    res?: Partial<express.Response>,
  ): Promise<void> | Promise<any>;
}

/**
 * Any Auth provider needs to implement this interface which handles the routes in the
 * auth backend. Any auth API requests from the frontend reaches these methods.
 *
 * The routes in the auth backend API are tied to these methods like below
 *
 * /auth/[provider]/start -> start
 * /auth/[provider]/handle/frame -> handle
 * /auth/[provider]/refresh -> refresh
 * /auth/[provider]/logout -> logout
 */
export interface AuthProviderRouteHandlers extends AuthProviderHandler {
  /**
   *(Optional) A method to identify the environment Context of the Request
   *
   *Request
   *- contains the environment context information encoded in the request
   *  @param {express.Request} req
   */
  identifyEnv?(req: Partial<express.Request>): string | undefined;
}

/**
 * Any OAuth provider needs to implement this interface which has provider specific
 * handlers for different methods to perform authentication, get access tokens,
 * refresh tokens and perform sign out.
 */
export interface OAuthProviderHandlers extends AuthProviderHandler {
  start(req: OAuthRequest): Promise<RedirectInfo>;

  handle(
    req: OAuthRequest,
  ): Promise<{
    response: AuthResponse<OAuthProviderInfo>;
    refreshToken?: string;
  }>;

  refresh?(req: OAuthRequest): Promise<AuthResponse<OAuthProviderInfo>>;
}

export type OAuthProviderOptions = {
  /**
   * Client ID of the auth provider.
   */
  clientId: string;
  /**
   * Client Secret of the auth provider.
   */
  clientSecret: string;
  /**
   * Callback URL to be passed to the auth provider to redirect to after the user signs in.
   */
  callbackUrl: string;
  /**
   * Public (true) or confidential client (false)? ("state" MUST be true when dealing with public clients)
   */
  pkce?: boolean;
};

/**
 * A type for the serialized value in the `state` parameter of the OAuth authorization flow
 */
export type OAuthState = {
  nonce: string;
  env: string;
};

export type OAuthRequest = Partial<express.Request> & {
  options?: Record<string, string>;
  refreshToken?: string;
  scope?: string;
};

export type OAuthResponse = AuthResponse<OAuthProviderInfo>;

export type OAuthProviderInfo = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * (Optional) Id token issued for the signed in user.
   */
  idToken?: string;
  /**
   * Expiry of the access token in seconds.
   */
  expiresInSeconds?: number;
  /**
   * Scopes granted for the access token.
   */
  scope: string;
};

export type OAuthPrivateInfo = {
  /**
   * A refresh token issued for the signed in user.
   */
  refreshToken: string;
};

export type SAMLProviderConfig = {
  entryPoint: string;
  issuer: string;
};

export type SAMLEnvironmentProviderConfig = {
  [key: string]: SAMLProviderConfig;
};

export type BackstageIdentity = AuthIdentity & {
  /**
   * An ID token that can be used to authenticate the user within Backstage.
   */
  idToken?: string;
};

/**
 * Used to display login information to user, i.e. sidebar popup.
 *
 * It is also temporarily used as the profile of the signed-in user's Backstage
 * identity, but we want to replace that with data from identity and/org catalog service
 */
export type ProfileInfo = {
  /**
   * Email ID of the signed in user.
   */
  email?: string;
  /**
   * Display name that can be presented to the signed in user.
   */
  displayName?: string;
  /**
   * URL to an image that can be used as the display image or avatar of the
   * signed in user.
   */
  picture?: string;
};

export type EnvironmentIdentifierFn = (
  req: Partial<express.Request>,
) => string | undefined;

export type RefreshTokenResponse = Partial<express.Response> & {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  params: any;
};

/**
 * Payload sent as a post message after the auth request is complete.
 * If successful then has a valid payload with Auth information else contains an error.
 */
export type WebMessageResponse =
  | {
      type: 'authorization_response';
      response: AuthResponse<unknown>;
    }
  | {
      type: 'authorization_response';
      error: Error;
    };

export type RedirectInfo = {
  /**
   * URL to redirect to
   */
  url: string;
  /**
   * Status code to use for the redirect
   */
  status?: number;
};

export type ProviderStrategy = {
  userProfile(accessToken: string, callback: Function): void;
};

export type PassportDoneCallback<Res, Private = never> = (
  err?: Error,
  response?: Res,
  privateInfo?: Private,
) => void;
