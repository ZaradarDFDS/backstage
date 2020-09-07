import { AuthConnector, CreateSessionOptions } from './types';
import { OktaAuth } from '@okta/okta-auth-js';

type Options<AuthSession> = {
  /**
   * Origin of auth requests, defaults to location.origin
   */
  apiOrigin?: string;
  /**
   * redirectUri passed to Okta library
   */
  redirectUri: string;
  /**
   * issuer passed to Okta library
   */
  issuer: string;
  /**
   * clientId passed to Okta library
   */
  clientId: string;  

  /**
   * Function used to join together a set of scopes, defaults to joining with a space character.
   */
  joinScopes?: (scopes: Set<string>) => string;
  /**
   * Function used to transform an auth response into the session type.
   */
  sessionTransform?(response: any): AuthSession | Promise<AuthSession>;
};

function defaultJoinScopes(scopes: Set<string>) {
  return [...scopes].join(' ');
}

export class ClientSideAuthConnector<AuthSession> implements AuthConnector<AuthSession> {
  // @ts-ignore
  private readonly apiOrigin : string;
  private readonly redirectUri : string;
  private readonly issuer : string;
  private readonly clientId : string;
  // @ts-ignore
  private readonly joinScopesFunc: (scopes: Set<string>) => string;
  // @ts-ignore
  private readonly sessionTransform: (response: any) => Promise<AuthSession>;


  constructor(options : Options<AuthSession>) {
    const {
      apiOrigin = window.location.origin,
      redirectUri,
      issuer,
      clientId,
      joinScopes = defaultJoinScopes,
      sessionTransform = id => id
    } = options;

    this.apiOrigin = apiOrigin;
    this.redirectUri = redirectUri;
    this.issuer = issuer;
    this.clientId = clientId;
    this.joinScopesFunc = joinScopes;
    this.sessionTransform = sessionTransform;
  }

  // @ts-ignore
  async createSession(options: CreateSessionOptions): Promise<AuthSession> {
    let queries = new URLSearchParams(window.location.search);

    const oktaAuth = new OktaAuth({
      issuer: this.issuer,
      clientId: this.clientId,
      redirectUri: this.redirectUri
    });

    if (queries.has('code')) {
      oktaAuth.token.parseFromUrl().then((resp) => {
        console.log(resp);
        return resp;
      });
    } else {
      oktaAuth.token.getWithRedirect({
        scopes: ['openid', 'email']
      });  
    }

    return "" as any;
  }

  async refreshSession(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async removeSession(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}