import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

// set route
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  // {
  //   path: "/my-bookings",
  //   route: UserRoutes,
  // },
  // {
  //   path: "/rooms",
  //   route: RoomRoutes,
  // },
  // {
  //   path: "/slots",
  //   route: SlotRoutes,
  // },
  // {
  //   path: "/bookings",
  //   route: BookingRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
