import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    //* Enviar email
    const info = await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Confirma tu cuenta",
      text: "UpTask - Confirma tu cuenta",
      html: `
            <style>
                 @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

                 .font-primary {
                    font-family: "Nunito", sans-serif;
                 }
                .message {
                    background-color: #073b4c; 
                    height: 8rem; 
                    color: white; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;                    
                }
                .text-message {
                    font-size: 1.4rem;
                    margin: .5rem;
                }
                .flex-about {
                    display: flex;
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center
                }
                .flex-about img {
                    width: 16rem;
                    height: auto;
                }
                .text-user {
                    font-size: 1.4rem;
                }
                .text-user span {
                    color: #14213d; 
                }
                .paragraph {
                    font-size: 1rem
                }
                .confirm-button {
                    width: 16rem;
                    text-align: center; 
                    text-decoration: none; 
                    background-color: #073b4c;
                    font-wight: 700;
                    text-transform: uppercase;
                    color: white;
                    padding: 1rem;
                    border-radius: .8rem;
                }
                .important {
                    color: #c1121f;
                }
            </style>

            <div>
                <div class="message">
                    <h2 
                        class="text-message font-primary">
                        Bienvenido a UpTask.
                    </h2>
                </div>

                <div class="flex-about">
                    <img 
                        src="https://i.ibb.co/yfJzHkb/celebration-email.webp" alt="Imagen Celebracion"
                    >

                    <h3 class="text-user font-primary">
                        Hola: <span>${user.name}</span>, has creado tu cuenta en UpTask.
                    </h3>

                     <p class="paragraph font-primary">
                       Ya casí esta todo listo solo debes de confirmar tu cuenta.
                       <br />
                       Visita el siguiente enlace:
                    </p>

                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account" 
                        class="confirm-button font-primary">
                        Confirmar cuenta
                    </a>
                    
                    <p class="paragraph font-primary">
                       E ingrese el código de confirmación: <b>${user.token}</b>
                    </p>
                     <p class="paragraph font-primary">
                       <span class="important">NOTA IMPORTANTE: </span> Este token expira en 10 minutos.
                    </p>
                </div>
            </div>
        `,
    });
    console.log("Email enviado correctamente", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    //* Enviar email
    const info = await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Reestablece tu password",
      text: "UpTask - Reestablece tu password",
      html: `
            <style>
                 @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

                 .font-primary {
                    font-family: "Nunito", sans-serif;
                 }
                .message {
                    background-color: #073b4c; 
                    height: 8rem; 
                    color: white; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;                    
                }
                .text-message {
                    font-size: 1.4rem;
                    margin: .5rem;
                }
                .flex-about {
                    display: flex;
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center
                }
                .flex-about img {
                    width: 16rem;
                    height: auto;
                }
                .text-user {
                    font-size: 1.4rem;
                }
                .text-user span {
                    color: #14213d; 
                }
                .paragraph {
                    font-size: 1rem
                }
                .confirm-button {
                    width: 16rem;
                    text-align: center; 
                    text-decoration: none; 
                    background-color: #073b4c;
                    font-wight: 700;
                    text-transform: uppercase;
                    color: white;
                    padding: 1rem;
                    border-radius: .8rem;
                }
                .important {
                    color: #c1121f;
                }
            </style>

            <div>
                <div class="message">
                    <h2 
                        class="text-message font-primary">
                        Reestablece tu password de UpTask.
                    </h2>
                </div>

                <div class="flex-about">
                    <img 
                        src="https://i.ibb.co/hW2J328/Forgot-password-amico.webp" alt="Imagen Celebracion"
                    >

                    <h3 class="text-user font-primary">
                        Hola: <span>${user.name}</span>, has solicitado reestablecer tu password.
                    </h3>

                     <p class="paragraph font-primary">
                       Ya casí esta todo listo solo debes de confirmar tu cuenta.
                       <br />
                       Visita el siguiente enlace:
                    </p>

                    <a href="${process.env.FRONTEND_URL}/auth/new-password" 
                        class="confirm-button font-primary">
                        Reestablecer password
                    </a>
                    
                    <p class="paragraph font-primary">
                       E ingrese el código de confirmación: <b>${user.token}</b>
                    </p>
                     <p class="paragraph font-primary">
                       <span class="important">NOTA IMPORTANTE: </span> Este token expira en 10 minutos.
                    </p>
                </div>
            </div>
        `,
    });
    console.log("Email enviado correctamente", info.messageId);
  };
}