import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PasswordResetRequests } from '@/entities/password-reset-requests.entity';
import { PASSWORD_RESET_REQUEST_REPOSITORY } from '@/modules/auth/constants';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject(PASSWORD_RESET_REQUEST_REPOSITORY)
    private readonly passwordResetRequestRepo: Repository<
      PasswordResetRequests
    >,
  ) {}

  async getValidPasswordRequest(email, code) {
    const passwordRequest = await this.passwordResetRequestRepo.find({
      where: {
        email,
        code,
        valid: true,
      },
    });

    if (!passwordRequest.length) {
      throw new NotFoundException('invalid password reset request');
    }

    return passwordRequest[0];
  }

  async savePasswordResetRequest(email: string, code: string) {
    const passwordResetRequest = new PasswordResetRequests();
    passwordResetRequest.code = code;
    passwordResetRequest.email = email;

    return await this.passwordResetRequestRepo.save(passwordResetRequest);
  }

  async updatePasswordResetRequest(request: PasswordResetRequests) {
    return await this.passwordResetRequestRepo.save(request);
  }
}
