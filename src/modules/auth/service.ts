import type { ApiResponse } from '../../models/api-response';
import type { AuthModel } from './model';
import { repository } from './repository';

export const service = {
  async register(data: AuthModel): Promise<ApiResponse> {
    return repository.register(data);
  },

  async login(data: AuthModel): Promise<ApiResponse> {
    return repository.login(data);
  },
};
