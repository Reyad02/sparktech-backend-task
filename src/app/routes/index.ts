import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import folderRoutes from "../modules/folder/folder.route";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/folders",
    route: folderRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
