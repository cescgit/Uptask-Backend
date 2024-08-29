import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Debes de agregar el nombre"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe de tener al menos 8 caracteres"),
  body("password_confirmation") // validando password desde un custom
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Los password no son iguales");
      }
      return true;
    }),
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Debes de agregar el email para iniciar sesión"),
  body("password")
    .notEmpty()
    .withMessage("Debes de agregar la contraseña para iniciar sesión"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email")
  .isEmail().withMessage("Email no válido"),  
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe de tener al menos 8 caracteres"),
  body("password_confirmation") // validando password desde un custom
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Los password no son iguales");
      }
      return true;
    }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user",
  authenticate,
  AuthController.user
)
export default router;
