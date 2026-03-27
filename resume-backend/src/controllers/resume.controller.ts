import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';

export class ResumeController {
  private resumeService = new ResumeService();

  process = async (req: Request, res: Response) => {
    try {
      const result = await this.resumeService.process(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao processar currículo.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}
