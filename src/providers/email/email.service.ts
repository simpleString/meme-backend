import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService, private readonly configSerivice: ConfigService) {}

  async sendComfirmation(code: number) {
    await this.mailService.sendMail({
      to: this.configSerivice.get('TEST_CONFIRMAION_MAIL'),
      subject: 'Confirm your phone!',
      template: './confirmation',
      context: {
        code: code,
      },
    });
  }
}
