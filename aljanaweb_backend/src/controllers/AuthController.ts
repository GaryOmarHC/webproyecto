import type { Request, Response } from 'express';
import User from '../models/User';
import Token from '../models/Token';
import {checkPassword, hashPassword} from '../utils/auth';
import {generateToken} from '../utils/token';
import {AuthEmail} from '../emails/AuthEmail';
import {generateJWT} from '../utils/jwt'

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const {password, email} = req.body

            //prevenir duplicados
            const userExist = await User.findOne({email})
            if(userExist){
                const error= new Error('El Usuario ya esta registrado')
                return res.status(409).json({error: error.message})
            }

            //Crea un usuario
            const user = new User(req.body)

            //Hash Password
            user.password = await hashPassword(password)

            //Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Cueanta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body

            const tokenExists =  await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            
            await Promise.allSettled([ user.save(), tokenExists.deleteOne() ])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req: Request, res: Response)=>{
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({error: error.message})
            }

            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

            //Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion')
                return res.status(401).json({error: error.message})
            }

            //Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Password incorrecto')
                return res.status(401).json({error: error.message})
            }

            const token = generateJWT({id: user.id})
            res.send(token)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario existe
            const user = await User.findOne({email})
            if(!user){
                const error= new Error('El Usuario no esta registrado')
                return res.status(404).json({error: error.message})
            }

            if(user.confirmed){
                const error = new Error('EL Usuario ya esta confirmado')
                return res.status(403).json({error: error.message})
            }

            //Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario existe
            const user = await User.findOne({email})
            if(!user){
                const error= new Error('El Usuario no esta registrado')
                return res.status(404).json({error: error.message})
            }

            //Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.body

            const tokenExists =  await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }
            res.send('Token valido, Define tu nuevo password')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.params
            const {password} = req.body

            const tokenExists =  await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('El password se modifico correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    
}