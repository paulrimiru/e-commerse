import { Injectable, Logger } from '@nestjs/common';

// tslint:disable-next-line: no-var-requires
const nodemailer = require('nodemailer');

// tslint:disable-next-line: no-var-requires
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const from = 'MyEshop.Ke<myeshop.254@gmail.com>';

export interface BaseEmailInfo {
  receiver: string;
}

export interface ConfimationEmailInfo {
  kind: 'confirmation-email';
  confirmationUrl: string;
}

export interface PasswordResetInfo {
  kind: 'password-reset';
  otp: string;
}

export type EmailInfo = BaseEmailInfo &
  (ConfimationEmailInfo | PasswordResetInfo);

@Injectable()
export class EmailService {
  transport;
  private readonly logger = new Logger(EmailService.name);
  constructor() {
    const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
    const myOAuth2Client = new OAuth2(
      process.env.EMAILCLIENT,
      process.env.EMAILCLIENTSECRET,
      OAUTH_PLAYGROUND,
    );

    myOAuth2Client.setCredentials({
      refresh_token: process.env.EMAILREFRESHTOKEN,
    });

    const myAccessToken = myOAuth2Client.getAccessToken();

    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAILCLIENT,
        clientSecret: process.env.EMAILCLIENTSECRET,
        refreshToken: process.env.EMAILREFRESHTOKEN,
        accessToken: myAccessToken,
      },
    });
  }

  async sendMail(emailInfo: EmailInfo) {
    let email: { [key: string]: string } = {
      from,
      to: emailInfo.receiver,
    };

    switch (emailInfo.kind) {
      case 'password-reset':
        email = {
          ...email,
          subject: 'Password Reset OTP',
          text: `
            We are very happy to have you here. Please reset your password using the OTP provided below.
            ${emailInfo.otp}
          `,
          html: `
            <h2 style="display: flex; align-items: center;">
                <img style="height: 25px; margin-right: .5em"
                src="http://3.17.158.38/assets/images/common/group-2@2x.png"
                alt="mmdp logo"> Password Reset OTP </h2>
                <p>We are very happy to have you here. Please reset your password using the OTP provided below.</p>
                </br>
                <b><h1>${emailInfo.otp}</h1></b>
          `,
        };
        break;
      case 'confirmation-email':
        email = {
          ...email,
          subject: 'Welcome to Ecommerse App',
          text: `
            Welcome to Ecommerse App. We are very happy to have you here. Please activate your account using the link below.
            ${emailInfo.confirmationUrl}
          `,
          html: `
            <h2 style="display: flex; align-items: center;">
              <img style="height: 25px; margin-right: .5em"
              src="http://3.17.158.38/assets/images/common/group-2@2x.png"
              alt="mmdp logo"> Welcome to Ecommerse App</h2>
              <p>We are very happy to have you here. Please activate your account using the link below.</p>
              ${emailInfo.confirmationUrl}
          `,
        };
      default:
        break;
    }

    try {
      this.logger.debug('sending email');
      await this.transport.sendMail(email);
      this.logger.debug('sent');
    } catch (error) {
      this.logger.error(error.stack);
    }
  }
}
