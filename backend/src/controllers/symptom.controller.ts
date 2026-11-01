import { Response } from 'express';
import { SymptomService } from '../services/symptom.service.js';
import { submitSymptomReportSchema } from '../validators/symptom.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const questions = await SymptomService.getQuestions();
    return res.status(200).json({ status: 'success', data: { questions } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const submitReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = submitSymptomReportSchema.parse(req.body);
    const report = await SymptomService.submitReport(validatedInput, req.user.userId);

    return res.status(201).json({
      status: 'success',
      message: 'Symptom report submitted successfully',
      data: { report },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getReportById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const report = await SymptomService.getReportById(id);
    return res.status(200).json({ status: 'success', data: { report } });
  } catch (error: any) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
};
