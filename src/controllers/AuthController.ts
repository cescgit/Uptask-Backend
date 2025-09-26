import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail" 
import { generateJWT } from "../utils/jwt"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir valores duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El usuario ya se encuentra registrado");
        return res.status(409).json({ error: error.message });
      }

      //* crea un usuario
      const user = new User(req.body);

      //* Hash Password
      user.password = await hashPassword(password);

      //* Generando token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //* Enviar Email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //* Mandar a guardar dos registro al mismo tiempo para evitar que primero se guarde uno, espera y luego guarda el otro
      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada correctamente, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      //* Revisar si el usuario existe en la base de datos
      if (!user) {
        const error = new Error("usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      //* Confirmar usuario
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        //* Enviar Email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un email de confirmación"
        );
        return res.status(401).json({ error: error.message });
      }

      //* Revisar Password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecto...");
        return res.status(401).json({ error: error.message });
      }

      const jwtToken = generateJWT({ id: user.id });
      res.send(jwtToken);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // revisar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El usuario ya tiene su cuenta confirmada");
        return res.status(403).json({ error: error.message });
      }

      //* Generando token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //* Enviar Email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envio un nuevo token a tu emial");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // revisar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      //* Generando token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //* Enviar Email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu email para seguir las instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }
      res.send("Token válido, define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("El password se modifico correctamente...");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };
}