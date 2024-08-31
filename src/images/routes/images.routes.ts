import { Router } from "express";
import imagesController from "../controllers/images.controller";

class ImagesRoutes {
  apiRouter: Router;
  constructor() {
    this.apiRouter = Router();
    this.publicRoutes();
  }
  publicRoutes(): void {
    this.apiRouter.post("/:category/:filename", imagesController.uploadImg);
    this.apiRouter.get("/:category/:filename", imagesController.getImg);
    this.apiRouter.patch("/:category/:filename", imagesController.updatedImg);
    this.apiRouter.delete("/:category/:filename", imagesController.deteleImg);
  }
}
const imgsRoutes = new ImagesRoutes();
export default imgsRoutes.apiRouter;
