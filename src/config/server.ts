import express, { Application } from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";
import { configDotenv } from "dotenv";
import imagesRoutes from "../images/routes/images.routes";

export default class Server {
  app: Application;
  PORT: string;
  private enableCors: string;
  constructor() {
    configDotenv();
    this.PORT = process.env.PORT || "8089";
    this.enableCors = process.env.ENABLE_CORS || "";
    this.app = express();
    this.initApp();
    this.activateRoutes();
  }

  initApp(): void {
    this.app.set("PORT", this.PORT);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this.enableCors }));
    this.app.use(morgan("dev"));
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(fileUpload());
  }

  activateRoutes(): void {
    this.app.use("/api/images", imagesRoutes);
  }

  start(): void {
    const auxPort = this.app.get("PORT");
    this.app.listen(auxPort, () => {
      console.log(`🚀Server is running on http://localhost:${auxPort}/api/images`);
    });
  }
}
