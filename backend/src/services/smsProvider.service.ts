import { env } from '../config/env.js';

export interface SmsResult {
  success: boolean;
  messageId: string;
  recipientPhone: string;
  provider: 'TWILIO' | 'TEST_MODE';
  failureReason?: string;
}

export class SmsProviderService {
  /**
   * Sends an SMS message using Twilio API or Test Redirection Mode.
   * Credentials remain strictly on the backend.
   */
  static async sendSms(targetPhone: string, body: string): Promise<SmsResult> {
    const isTestMode = env.TEST_EMERGENCY_NOTIFICATION === 'true' || !env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN;
    const recipient = isTestMode ? env.TEST_NOTIFICATION_RECIPIENT_PHONE : (targetPhone || env.TEST_NOTIFICATION_RECIPIENT_PHONE);

    if (isTestMode) {
      console.log(`====================================================`);
      console.log(`📱 [TEST SMS PROVIDER MODE] Notification Redirected`);
      console.log(`📞 Recipient: ${recipient} (Original Target: ${targetPhone || 'DB User'})`);
      console.log(`💬 Body: ${body}`);
      console.log(`====================================================`);

      return {
        success: true,
        messageId: `sms-test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientPhone: recipient,
        provider: 'TEST_MODE',
      };
    }

    try {
      // Live Twilio REST API Request
      const accountSid = env.TWILIO_ACCOUNT_SID;
      const authToken = env.TWILIO_AUTH_TOKEN;
      const fromPhone = env.TWILIO_PHONE_NUMBER;

      const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', recipient);
      params.append('From', fromPhone);
      params.append('Body', body);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = (await response.json()) as any;

      if (response.ok && data.sid) {
        return {
          success: true,
          messageId: data.sid,
          recipientPhone: recipient,
          provider: 'TWILIO',
        };
      }

      return {
        success: false,
        messageId: `sms-fail-${Date.now()}`,
        recipientPhone: recipient,
        provider: 'TWILIO',
        failureReason: data.message || `Twilio HTTP Error ${response.status}`,
      };
    } catch (err: any) {
      console.error('[SmsProviderService] Twilio dispatch error:', err.message);
      return {
        success: false,
        messageId: `sms-err-${Date.now()}`,
        recipientPhone: recipient,
        provider: 'TWILIO',
        failureReason: err.message || 'Network dispatch timeout',
      };
    }
  }
}
