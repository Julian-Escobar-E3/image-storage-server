import fs from "fs-extra";
import { configDotenv } from "dotenv";
import { SIZE_OPTIONS } from "../../utilities/size-options";
import sharp from "sharp";

configDotenv();

export default class ImagesDAO {
  private basePath = process.env.FOLDER || "";
  async getImage(
    category: string,
    fileFolder: string,
    filename: string
  ): Promise<Buffer | string> {
    const imagePath = `${this.basePath}/${category}/${fileFolder}/${filename}.png`;
    try {
      const file = await fs.readFile(imagePath);
      return file;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        //'ENOENT' se usa para verificar si el archivo no fue encontrado
        console.error("Error, can not find the path of image");
        return "Error, can not find the path of image";
      } else {
        console.error("Error ==>", err);
        throw new Error("Internal server error, please check logs");
      }
    }
  }

  async postImage(
    category: string,
    fileFolder: string,
    filename: string,
    newImage: any
  ): Promise<string | null> {
    const imagePath = `${process.env.FOLDER}/${category}/${fileFolder}/`;
    try {
      await fs.ensureDir(imagePath); //Crear el directorio si no existe
      const resizePromise = Object.values(SIZE_OPTIONS).map((size) =>
        sharp(newImage.data)
          .resize(size.width)
          .toFile(`${imagePath}/${size.name}-${filename}.png`)
      );
      await Promise.all(resizePromise);
      return filename;
    } catch (error) {
      console.log("Error with de uploading img process => ", error);
      return null;
    }
  }

  async patchImage(
    category: string,
    fileFolder: string,
    filename: string,
    updatedImg: any
  ): Promise<string | null> {
    const uploadPath = `${this.basePath}/${category}/${fileFolder}/`;
    const preUploadPath = `${this.basePath}/${category}/${fileFolder}`;
    try {
      if (fs.pathExistsSync(preUploadPath)) {
        await fs.remove(preUploadPath);
      } else {
        console.log("Directory not found");
        return null;
      }
      await fs.ensureDir(uploadPath);
      const resizePromises = Object.values(SIZE_OPTIONS).map((size) =>
        sharp(updatedImg.data)
          .resize(size.width)
          .toFile(`${uploadPath}/${size.name}-${filename}.png`)
      );
      await Promise.all(resizePromises);
      return filename;
    } catch (error: any) {
      console.error("Error processing image:", error);
      return null;
    }
  }

  async deleteImage(category: string, fileFolder: string) {
    const filePath = `${this.basePath}/${category}/${fileFolder}`;
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        return "Image was delete.";
      } else {
        console.log("Error, the old image data cannot be deleted.");
        return null;
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      return null;
    }
  }
}
