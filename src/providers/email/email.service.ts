import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService, private readonly configService: ConfigService) {}

  async sendConfirmation(code: number) {
    await this.mailService.sendMail({
      to: this.configService.get('TEST_CONFIRMATION_MAIL'),
      subject: 'Confirm your phone!',
      template: './confirmation',
      context: {
        code: code,
      },
    });
  }
}
