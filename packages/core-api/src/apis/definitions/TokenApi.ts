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
import { ApiRef, createApiRef } from '../system';
import { OAuthScope } from './auth';

export interface ITokenAcquisitionService {
  acquireTokenSilent?(scopes: OAuthScope): Promise<string>;
}

/**
 * The Token API used to acquire tokens user tokens (not provider based) for API calls.
 */
export type TokenApi = ITokenAcquisitionService;

export const tokenApiRef: ApiRef<TokenApi> = createApiRef({
  id: 'core.token',
  description: 'Provides access to the token acquisition API',
});
