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

import { LocationSpec } from '@backstage/catalog-model';
import fetch, { RequestInit, HeadersInit } from 'node-fetch';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

export class AzureDevOpsReaderProcessor implements LocationProcessor {
  private authCredentials: string =
    process.env.AZUREDEVOPS_AUTH_CREDENTIALS || '';

  getRequestOptions(): RequestInit {
    const headers: HeadersInit = {
      Accept: 'application/json',
    };

    if (this.authCredentials !== '') {
      headers.Authorization = `Basic ${this.authCredentials}`;
    }

    const requestOptions: RequestInit = {
      headers,
    };

    return requestOptions;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'azuredevops') {
      return false;
    }

    try {
      const url = this.buildRawUrl(location.target);

      const fileObj = await this.getObjectInfo(url);
      const requestOptions = this.getRequestOptions();
      (requestOptions.headers as any).Accept = null;
      const response = await fetch(fileObj._links.blob, requestOptions);

      if (response.ok) {
        const data = await response.buffer();
        emit(result.data(location, data));
      } else {
        const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          if (!optional) {
            emit(result.notFoundError(location, message));
          }
        } else {
          emit(result.generalError(location, message));
        }
      }
    } catch (e) {
      const message = `Unable to read ${location.type} ${location.target}, ${e}`;
      emit(result.generalError(location, message));
    }

    return true;
  }

  async getObjectInfo(url: URL): Promise<ObjectInfoResponse> {
    const response = await fetch(url.toString(), this.getRequestOptions());

    if (response.ok) {
      const data = await response.buffer();
      const rawData = data.toString();
      const payload: ObjectInfoResponse = JSON.parse(rawData);

      return payload;
    }
    throw new Error('Unable to get OK response for given location');
  }

  // Converts
  // from: https://dev.azure.com/dfds-dev/backstage-dev/_git/component-test?path=%2Fpipeline.sh
  // to:   https://dev.azure.com/dfds-dev/backstage-dev/_apis/git/repositories/component-test/items?path=%2Fpipeline.sh
  buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        // @ts-ignore
        empty,
        org,
        teamName,
        resourceType,
        repoName,
        // @ts-ignore
        ...restOfPath
      ] = url.pathname.split('/');

      const filePath = url.searchParams.get('path');

      if (
        url.hostname !== 'dev.azure.com' ||
        org === '' ||
        teamName === '' ||
        resourceType === '' ||
        repoName === 'blob' ||
        !filePath?.includes('.yaml')
      ) {
        throw new Error('Wrong Azure DevOps URL or Invalid file path');
      }

      // transform to api
      url.pathname = [
        org,
        teamName,
        '_apis',
        'git',
        'repositories',
        repoName,
        'items',
      ].join('/');
      url.hostname = 'dev.azure.com';
      url.protocol = 'https';
      url.search = `path=${filePath}`;

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }
}

class ObjectInfoResponseLink {
  href: string = '';
}

class ObjectInfoResponseLinks {
  self: ObjectInfoResponseLink = new ObjectInfoResponseLink();
  repository: ObjectInfoResponseLink = new ObjectInfoResponseLink();
  blob: ObjectInfoResponseLink = new ObjectInfoResponseLink();
}

class ObjectInfoResponse {
  objectId: string = '';
  gitObjectType: string = '';
  commitId: string = '';
  path: string = '';
  url: string = '';
  _links: ObjectInfoResponseLinks = new ObjectInfoResponseLinks();
}
