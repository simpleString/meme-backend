import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // transport: 'smtps://user@domain.com:pass@smtp.domain.com',
        transport: {
          host: 'smtp.yandex.ru',
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"nest-modules" <${configService.get('EMAIL_ADDRESS_FROM')}>`,
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule,
  ],
  exports: [EmailService],
})
export class EmailModule {}
