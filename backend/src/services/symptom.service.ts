import { PrismaClient } from '@prisma/client';
import { SubmitSymptomReportInput } from '../validators/symptom.validator.js';
import { AIBridgeService } from './aiBridge.service.js';

const prisma = new PrismaClient();

export class SymptomService {
  static async submitReport(
    input: SubmitSymptomReportInput,
    userId: string
  ) {
    // ---------------------------------------------------------
    // 1. Block explicitly flagged medical images
    // ---------------------------------------------------------
    if (input.isExplicitImageFlagged) {
      return {
        id: `report-flagged-${Date.now()}`,
        status: 'MODERATION_BLOCKED',
        moderationWarning:
          'For intimate or sexually explicit medical concerns, automated image processing is restricted. Please consult a qualified healthcare professional directly.',
        requiresDirectConsultation: true,
        createdAt: new Date().toISOString(),
      };
    }

    // ---------------------------------------------------------
    // 2. Send symptom data + website triage payload to AI
    // ---------------------------------------------------------
    const aiAssessment = await AIBridgeService.assessSymptoms({
      free_text_symptoms: input.freeTextSymptoms,
      pain_scale: input.painScale,
      duration_days: input.durationDays,
      structured_inputs: input.structuredInputs,

      // IMPORTANT:
      // This sends the 16-feature website XGBoost payload
      // to the Python FastAPI AI service.
      triagePayload: input.triagePayload,
    });

    // ---------------------------------------------------------
    // 3. Save report to database
    // ---------------------------------------------------------
    try {
      let studentId = userId;

      const student = await prisma.studentProfile.findFirst({
        where: {
          userId,
        },
      });

      if (student) {
        studentId = student.id;
      }

      const report = await prisma.symptomReport.create({
        data: {
          studentId,

          freeTextSymptoms: input.freeTextSymptoms,

          painScale: input.painScale,

          durationDays: input.durationDays,

          imageUrl: input.imageUrl,

          structuredInputs: input.structuredInputs || {},

          aiPrediction: {
            create: {
              topConditions:
                aiAssessment.top_conditions || [],

              predictedSeverity:
                aiAssessment.predicted_severity,

              severityScore:
                aiAssessment.severity_score ?? 0,

              extractedSymptoms:
                aiAssessment.extracted_symptoms || [],

              contributingFactors:
                aiAssessment.contributing_factors || [],

              recommendedAction:
                aiAssessment.recommended_action,

              safetyOverrideTriggered:
                aiAssessment.safety_override_triggered ?? false,

              safetyOverrideReason:
                aiAssessment.safety_override_reason ?? null,
            },
          },
        },

        include: {
          aiPrediction: true,
        },
      });

      const triageOutcome = (aiAssessment as { triage_outcome?: string })
        .triage_outcome;

      return triageOutcome
        ? {
            ...report,
            aiPrediction: {
              triage_outcome: triageOutcome,
            },
          }
        : report;
    } catch (err) {
      // -------------------------------------------------------
      // 4. Preserve the XGBoost result when database persistence is unavailable.
      // -------------------------------------------------------
      console.warn(
        '[SymptomService] DB report creation failed, returning mock report with AI prediction'
      );

      return {
        id: `report-demo-${Date.now()}`,

        studentId: userId,

        freeTextSymptoms:
          input.freeTextSymptoms ||
          'Fever, headache and weakness for 3 days',

        painScale: input.painScale,

        durationDays: input.durationDays,

        imageUrl: input.imageUrl || null,

        structuredInputs:
          input.structuredInputs || {},

        aiPrediction: {
          ...aiAssessment,
          triage_outcome: (aiAssessment as { triage_outcome?: string })
            .triage_outcome,
        },

        createdAt: new Date().toISOString(),
      };
    }
  }
}
