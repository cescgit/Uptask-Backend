import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";

const router = Router();


// * Valida que el usuario este atenticado, y se dispara en todos los rouetes
router.use(authenticate);

// * Routes for Task
router.param("projectId", projectExists)

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("Debes de agregar el nombre del proyecto..."),
  body("clientName")
    .notEmpty()
    .withMessage("Debes de agregar el nombre del cliente..."),
  body("description")
    .notEmpty()
    .withMessage("Debes de agregar una breve descripción al proyecto..."),
  handleInputErrors,

  ProjectController.createProject
);

// * Código repetitivo, por ello se crea un afunción en Middleware
router.get("/", ProjectController.getAllProject);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Id no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("Debes de agregar el nombre del proyecto..."),
  body("clientName")
    .notEmpty()
    .withMessage("Debes de agregar el nombre del cliente..."),
  body("description")
    .notEmpty()
    .withMessage("Debes de agregar una breve descripción al proyecto..."),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  ProjectController.deleteProject
);


// * Routes for Task
router.post(
  "/:projectId/tasks",
  body("name")
    .notEmpty()
    .withMessage("Debes de agregar el nombre de la tarea..."),
  body("description")
    .notEmpty()
    .withMessage("Debes de agregar la descripción de la tarea..."),
    handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", 
  TaskController.getProjectTasks
);

//* Código repetitivo, por ello se crea un afunción en Middleware, pero este se ejecuta según  el orden que esta llamando las funciones: Primero: taskExists, Segundo: taskBelongsToProject

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no válido"),
  body("name")
    .notEmpty()
    .withMessage("Debes de agregar el nombre de la tarea..."),
  body("description")
    .notEmpty()
    .withMessage("Debes de agregar la descripción de la tarea..."),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Id no válido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  TaskController.updateTaskStatus
);


// * Routes for teams
router.post("/:projectId/team/find",
  body("email").notEmpty().withMessage("Email no válido"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get("/:projectId/team",
  TeamController.getProjectTeam
);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  TeamController.addMemberById
);


router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  TeamController.removeMemberById
);

export default router;
