import { Injectable } from '@angular/core';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import aws_exports from '../aws-exports';
import { Auth } from 'aws-amplify';
@Injectable({
  providedIn: 'root'
})
export class AppsyncService {

  private _hc: any;

  constructor() {
    const client = new AWSAppSyncClient({
      url: aws_exports.aws_appsync_graphqlEndpoint,
      region: aws_exports.aws_appsync_region,
      auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
      }
    });
    this._hc = client;
  }

  hc = () => {
    return this._hc.hydrated();
  }
}
