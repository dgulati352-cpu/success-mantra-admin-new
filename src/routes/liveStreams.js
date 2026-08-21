import express from 'express';
import * as liveStreamController from '../controllers/liveStreamController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', liveStreamController.getLiveStreams);
router.get('/upcoming', liveStreamController.getUpcomingStreams);
router.get('/recorded', liveStreamController.getRecordedStreams);
router.get('/:id', liveStreamController.getLiveStream);

router.post('/', authenticate, authorize('instructor', 'admin'), liveStreamController.createLiveStream);
router.patch('/:id', authenticate, authorize('instructor', 'admin'), liveStreamController.updateLiveStream);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), liveStreamController.deleteLiveStream);

router.post('/:id/start', authenticate, authorize('instructor', 'admin'), liveStreamController.startLiveStream);
router.post('/:id/end', authenticate, authorize('instructor', 'admin'), liveStreamController.endLiveStream);
router.post('/:id/join', authenticate, liveStreamController.joinLiveStream);
router.post('/:id/leave', authenticate, liveStreamController.leaveLiveStream);

export default router;