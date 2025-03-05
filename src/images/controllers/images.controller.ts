import { Request, Response } from "express";
import ImagesDAO from "../daos/images.dao";
import { ValidPaths } from "../../enums/valid-paths";

class ImagesController extends ImagesDAO {
  async getImg(req: Request, res: Response) {
    const { filename, category } = req.params;
    const aux = filename.indexOf("-"); //Identificamos donde esta el primer "-" para separar el tamaño del nombre
    const folderImageName = filename.substring(aux + 1); //sacamos el nombre de la imagen que será tambien del archivo
    const response = await imagesController.getImage(
      category,
      folderImageName,
      filename
    );
    if (typeof response === "string") {
      res.status(400).json({ Message: response });
    } else {
      res.set("Content-Type", "image/png");
      res.send(response); //Enviamos la imagen por Buffer
    }
  }
  async uploadImg(req: Request, res: Response) {
    const { filename, category } = req.params;
    // Validar categoría
    if (!Object.values(ValidPaths).includes(category as ValidPaths)) {
      return res.status(400).json({ Message: "Invalid category" });
    }
    // Validar archivo
    if (!req.files || !req.files.newImg) {
      return res.status(400).json({ Message: "No files were uploaded." });
    }
    const newImg: any = req.files!.newImg;
    if (newImg.mimetype !== "image/png") {
      return res
        .status(400)
        .json({ Message: "Invalid file type. Only PNG files are allowed." });
    }
    try {
      const response = await imagesController.postImage(
        category,
        filename,
        filename,
        newImg
      );
      if (!response) {
        return res.status(400).json({
          Message:
            "Error in upload image process, make sure the name is unique.",
        });
      }
      res.status(201).json({ data: response });
    } catch (error) {
      console.error("Error in uploadImg method:", error);
      res.status(418).json({ Message: "Internal server error" });
    }
  }
  async updatedImg(req: Request, res: Response) {
    const { filename, category } = req.params;
    // Validar archivo
    if (!req.files || !req.files.updatedImg) {
      return res.status(400).json({ Message: "No files were uploaded." });
    }
    const updatedImg: any = req.files.updatedImg;
    //Validar tipo de archivo
    if (updatedImg.mimetype !== "image/png") {
      return res
        .status(400)
        .json({ Message: "Invalid file type. Only PNG files are allowed." });
    }
    try {
      const response = await imagesController.patchImage(
        category,
        filename,
        filename,
        updatedImg
      );
      if (!response) {
        return res.status(400).json({
          Message:
            "Error in updated image process, make sure the name is unique.",
        });
      }
      res.status(200).json({ data: response });
    } catch (error) {
      console.error("Error in uploadImg method:", error);
      res.status(418).json({ Message: "Internal server error" });
    }
  }

  async deteleImg(req: Request, res: Response) {
    const { filename, category } = req.params;
    try {
      const response = await imagesController.deleteImage(category, filename);

      if (!response) {
        return res
          .status(400)
          .json({
            Message:
              "Error in delete image process, make sure the path is correct",
          });
      }

      res.status(200).json({ data: response });
    } catch (error) {
      console.error("Error delete method:", error);
      res.status(418).json({ Message: "Internal server error" });
    }
  }
}
const imagesController = new ImagesController();
export default imagesController;
