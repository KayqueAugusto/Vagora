import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';

const router = Router();
const controller = new ResumeController();

router.post('/process', controller.process);

export { router as resumeRoutes };
