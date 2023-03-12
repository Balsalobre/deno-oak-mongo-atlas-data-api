import { Router } from 'https://deno.land/x/oak/mod.ts';
import {
  getRestaurantByName,
  getRestaurants,
} from './restaurant/controller.ts';

const router = new Router();

router.get('/api/v1/restaurant', getRestaurantByName);
router.get('/api/v1/restaurants', getRestaurants);

export default router;
