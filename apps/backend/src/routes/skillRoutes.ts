import { Router } from 'express';
import {
  getAllSkills,
  addUserSkill,
  addUserSkillValidation,
  removeUserSkill,
  getMySkills,
  findMatches,
} from '../controllers/skillController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getAllSkills);

router.use(protect);

router.get('/my-skills', getMySkills);
router.get('/matches', findMatches);
router.post('/my-skills', addUserSkillValidation, addUserSkill);
router.delete('/my-skills/:id', removeUserSkill);

export default router;
