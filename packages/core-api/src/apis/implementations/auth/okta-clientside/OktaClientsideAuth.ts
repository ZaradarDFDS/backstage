import { OAuthApi, ProfileInfoApi, BackstageIdentityApi, SessionStateApi, OpenIdConnectApi, SessionState } from "../../../definitions";
import { Observable } from "../../../../types";
import { OAuthRequestApi, AuthProvider } from '../../../definitions';
import { DefaultAuthConnector, ClientSideAuthConnector } from '../../../../lib/AuthConnector';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { StaticAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { OktaAuth } from '@okta/okta-auth-js';

type CreateOptions = {
  apiOrigin: string;
  basePath: string;

  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

const DEFAULT_PROVIDER = {
  id: 'okta_clientside',
  title: 'Okta_Clientside',
  icon: null as any,
};

const OKTA_OIDC_SCOPES: Set<String> = new Set(
  ['openid', 'profile', 'email', 'phone', 'address', 'groups', 'offline_access']
)

const OKTA_SCOPE_PREFIX: string = 'okta.'

class OktaClientsideAuth implements OAuthApi, OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionStateApi {
  static redirectUri = 'http://localhost:3000/backend/okta/redirect';
  static issuer = 'https://dfds-devex.okta.com';
  static clientId = '0oar9mg01dw76fjUe4x6';


  static create({apiOrigin, basePath, environment = 'development', provider = DEFAULT_PROVIDER, oauthRequestApi} : CreateOptions) {
  // @ts-ignore
    const connector = new DefaultAuthConnector({
      apiOrigin,
      basePath,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi
    });

    const clientSideConnector = new ClientSideAuthConnector({
      apiOrigin,
      redirectUri: OktaClientsideAuth.redirectUri,
      issuer: OktaClientsideAuth.issuer,
      clientId: OktaClientsideAuth.clientId,
    });

  // @ts-ignore
    const sessionManagerX = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set([
        'openid',
        'email',
        'profile',
        'offline_access',
      ]),
      sessionScopes: session => session.scopes,
      sessionShouldRefresh: session => {
        const expiresInSec =
          (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    const sessionManager = new StaticAuthSessionManager({
      connector: clientSideConnector, 
      defaultScopes: new Set(['openid', 'email', 'profile', 'offline_access']),
      sessionScopes: session => session.scopes,
    });

    return new OktaClientsideAuth(sessionManager);
  }

  // @ts-ignore
  constructor(private readonly sessionManager: SessionManager<any>) {}

  // @ts-ignore
  async getAccessToken(scope?: string | string[] | undefined, options?: import("../../../definitions").AuthRequestOptions | undefined): Promise<string> {
    // let queries = new URLSearchParams(window.location.search);

    // const oktaAuth = new OktaAuth({
    //   issuer: 'https://dfds-devex.okta.com',
    //   clientId: '0oar9mg01dw76fjUe4x6',
    //   redirectUri: 'http://localhost:3000/backend/okta/redirect'
    // });

    // if (queries.has('code')) {
    //   oktaAuth.token.parseFromUrl().then((resp) => {
    //     console.log(resp);
    //   });
    // } else {
    //   oktaAuth.token.getWithRedirect({
    //     scopes: ['openid', 'email']
    //   });  
    // }

    const session = await this.sessionManager.getSession({
      ...options,
      scopes: OktaClientsideAuth.normalizeScopes(scope),
    });

    let queries = new URLSearchParams(window.location.search);

    const oktaAuth = new OktaAuth({
      redirectUri: OktaClientsideAuth.redirectUri,
      issuer: OktaClientsideAuth.issuer,
      clientId: OktaClientsideAuth.clientId,
    });

    if (queries.has('code')) {
      console.log("Code detected");
      oktaAuth.token.parseFromUrl().then((resp) => {
        console.log(resp);
        //return resp;
      });
    }

    console.log("Calling sessionManager for accessToken");
    return session?.providerInfo.accessToken ?? '';


    // throw new Error("Method not implemented.");
  }
  logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // @ts-ignore
  getIdToken(options?: import("../../../definitions").AuthRequestOptions | undefined): Promise<string> {
    throw new Error("Method not implemented.");
  }
  // @ts-ignore
  getProfile(options?: import("../../../definitions").AuthRequestOptions | undefined): Promise<import("../../../definitions").ProfileInfo | undefined> {
    throw new Error("Method not implemented.");
  }
  // @ts-ignore
  getBackstageIdentity(options?: import("../../../definitions").AuthRequestOptions | undefined): Promise<import("../../../definitions").BackstageIdentity | undefined> {
    throw new Error("Method not implemented.");
  }
  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
    throw new Error("Method not implemented.");
  }

  static normalizeScopes(scopes?: string | string[]): Set<string> {
    if (!scopes) {
      return new Set();
    }

    const scopeList = Array.isArray(scopes)
      ? scopes
      : scopes.split(/[\s|,]/).filter(Boolean);

    const normalizedScopes = scopeList.map(scope => {
      if (OKTA_OIDC_SCOPES.has(scope)) {
        return scope;
      }

      if (scope.startsWith(OKTA_SCOPE_PREFIX)) {
        return scope;
      }
      
      return `${OKTA_SCOPE_PREFIX}${scope}`
    });

    return new Set(normalizedScopes);
  }

}

export default OktaClientsideAuth;