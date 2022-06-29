import { Router } from 'express';
import InformationsController from '../controllers/InformationsController';

const router = Router();
const informationController = new InformationsController();

router.get('/contacts/', informationController.get);
router.post('/contacts', informationController.add);
router.put('/contacts/:id', informationController.update);
router.delete('/contacts/:id', informationController.delete);

export default router;