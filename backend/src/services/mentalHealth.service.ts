import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { SubmitMentalHealthInput } from '../validators/mentalHealth.validator.js';

const prisma = new PrismaClient();

type MentalHealthModelResult = {
  prediction: 'High' | 'Low' | 'Medium';
  confidence: number;
  risk_category: 'HIGH_CONCERN' | 'LOW_CONCERN' | 'MEDIUM_CONCERN';
  disclaimer: string;
};

export class MentalHealthService {
  static async submitScreening(input: SubmitMentalHealthInput, userId: string) {
    const response = await axios.post<MentalHealthModelResult>(
      `${env.AI_SERVICE_URL}/ai/mental-health/assess`,
      input.answers,
      { timeout: 5000 }
    );
    const assessment = response.data;

    console.log('[MentalHealthService] XGBoost result:', assessment);

    const isReferred = assessment.prediction === 'High';
    const counselorNote = assessment.prediction === 'High'
      ? 'Please meet the college mental-health counselor as soon as possible for confidential support.'
      : assessment.prediction === 'Medium'
        ? 'A confidential meeting with the college mental-health counselor is recommended.'
        : 'A counselor visit is not currently recommended based on this screening result.';

    try {
      let studentId = userId;
      const student = await prisma.studentProfile.findFirst({ where: { userId } });
      if (student) studentId = student.id;

      const screening = await prisma.mentalHealthScreening.create({
        data: {
          studentId,
          responses: input.answers,
          riskLevel: assessment.risk_category,
          isReferred,
          counselorNote,
        },
      });

      return { ...screening, ...assessment };
    } catch (error) {
      console.warn('[MentalHealthService] DB operation failed; returning XGBoost result without persistence.');
      return {
        id: `mh-demo-${Date.now()}`,
        studentId: userId,
        responses: input.answers,
        riskLevel: assessment.risk_category,
        isReferred,
        counselorNote,
        createdAt: new Date().toISOString(),
        ...assessment,
      };
    }
  }
}
