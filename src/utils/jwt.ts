import jwt from "jsonwebtoken";
import Types from "mongoose"

type UserPayload = {
    id: Types.ObjectId
}

export const generateJWT = (payload: UserPayload) => {

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    // El token se valida por días, si se coloca " m ", estos son de minutos, así que se debe de usar " d "
    expiresIn: "1d",
  });

  return token;
};