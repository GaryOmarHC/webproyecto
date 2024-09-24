import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Aljañaweb <admin@aljañaweb.com>',
            to: user.email,
            subject: 'Aljañaweb - Confirma tu cuenta',
            text: 'Aljañaweb - Confirma tu cuenta',
            html: `<p> Hola: ${user.name}, has creado tu cuenta en Aljañaweb</p>
                <p> Visista el siguiente enlace:</p>
                <a href= "${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p> Ingreasa el código: <b>${user.token}</b></p>
                <p> Estee token expira en 10 minutos</p>

            `
        })

        console.log('Mensaje enviado', info.messageId)
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Aljañaweb <admin@aljañaweb.com>',
            to: user.email,
            subject: 'Aljañaweb - Restablece tu password',
            text: 'Aljañaweb - Confirma tu cuenta',
            html: `<p> Hola: ${user.name}, has solicitado restablecer tu password</p>
                <p> Visista el siguiente enlace:</p>
                <a href= "${process.env.FRONTEND_URL}/auth/new-password">Restablecer Password</a>
                <p> Ingreasa el código: <b>${user.token}</b></p>
                <p> Estee token expira en 10 minutos</p>

            `
        })

        console.log('Mensaje enviado', info.messageId)
    }

}