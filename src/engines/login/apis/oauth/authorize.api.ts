import { VApiConfig } from '@/lib/vails/api/index';
import { VObject } from '@/lib/vails/model/index';
import { AuthSessionApi } from '../auth/session.api';
import { MyApi } from '@/engines/base/apis/MyApi';

export class OauthAuthorizeApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/oauth',
      name: 'authorize',
      mode: 'single',
      ...config,
      wrapParams: false,
    });
  }

  success(query: VObject) {
    const { response_type, client_id, state, redirect_uri, scope } = query;

    this.create({
      response_type,
      client_id,
      state,
      redirect_uri,
      scope,
      token: AuthSessionApi.token(),
    }).then(({ data }) => {
      window.location.replace(data.redirect_uri);
    });
  }
}
