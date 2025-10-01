import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {

    const project = new Project(req.body)

    // Asignar manager para el proyecto
    project.manager = req.user.id
    try {
      await project.save()
      res.send("Proyecto creado correctamente...");
    } catch (error) {
      console.log(error.message);
    }
  };

  static getAllProject = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } }
        ]
      });
      res.json(projects);
    } catch (error) {
      console.log(error.message);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks")
      if (!project) {
        const error = new Error(
          "Parece que el proyecto que estas buscando no fue encontrado..."
        );
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
        const error = new Error(
          "Acción no válida..."
        );
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error.message);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error(
          "Parece que el proyecto que estas buscando no fue encontrado..."
        );
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el Manager puede actualizar el proyecto");
        return res.status(404).json({ error: error.message });
      }

      project.projectName = req.body.projectName;
      project.clientName = req.body.clientName
      project.description = req.body.description
      await project.save();
      res.send("Proyecto actualizado correctamente...");
    } catch (error) {
      console.log(error.message);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error(
          "Parece que el proyecto que estas buscando no fue encontrado..."
        );
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el Manager puede eliminar el proyecto");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne()
      res.send("Proyecto eliminado correctamente...");
    } catch (error) {
      console.log(error.message);
    }
  };
}