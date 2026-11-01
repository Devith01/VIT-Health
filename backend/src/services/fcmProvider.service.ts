import { env } from '../config/env.js';

export interface PushResult {
  success: boolean;
  messageId: string;
  recipientToken: string;
  provider: 'FCM' | 'TEST_MODE';
  failureReason?: string;
}

export class FcmProviderService {
  /**
   * Sends an FCM Push Notification using Server Credentials or Test Redirection Mode.
   * Server credentials remain strictly in backend environment variables.
   */
  static async sendPushNotification(
    targetToken: string | undefined,
    title: string,
    body: string,
    dataPayload: Record<string, string>
  ): Promise<PushResult> {
    const isTestMode = env.TEST_EMERGENCY_NOTIFICATION === 'true' || !env.FCM_SERVER_KEY;
    const recipientToken = isTestMode
      ? env.TEST_NOTIFICATION_RECIPIENT_FCM
      : (targetToken || env.TEST_NOTIFICATION_RECIPIENT_FCM);

    if (isTestMode) {
      console.log(`====================================================`);
      console.log(`🔔 [TEST FCM PUSH MODE] Notification Redirected`);
      console.log(`🎯 Token: ${recipientToken} (Target User Token)`);
      console.log(`📌 Title: ${title}`);
      console.log(`💬 Body: ${body}`);
      console.log(`📦 Data Payload:`, JSON.stringify(dataPayload));
      console.log(`====================================================`);

      return {
        success: true,
        messageId: `fcm-test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientToken,
        provider: 'TEST_MODE',
      };
    }

    try {
      // Firebase Cloud Messaging REST API Dispatch
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${env.FCM_SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientToken,
          notification: {
            title,
            body,
            sound: 'default',
            priority: 'high',
          },
          data: dataPayload,
        }),
      });

      const data = (await response.json()) as any;

      if (response.ok && data.message_id) {
        return {
          success: true,
          messageId: String(data.message_id),
          recipientToken,
          provider: 'FCM',
        };
      }

      return {
        success: false,
        messageId: `fcm-fail-${Date.now()}`,
        recipientToken,
        provider: 'FCM',
        failureReason: data.error || `FCM Error Status ${response.status}`,
      };
    } catch (err: any) {
      console.error('[FcmProviderService] FCM push error:', err.message);
      return {
        success: false,
        messageId: `fcm-err-${Date.now()}`,
        recipientToken,
        provider: 'FCM',
        failureReason: err.message || 'Push dispatch timeout',
      };
    }
  }
}
