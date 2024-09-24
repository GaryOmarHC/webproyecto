import{Request, Response, Nextfunction} from 'express'
import jwt from 'jsonwebtoken'

export const authenticate = async (req: Request,res: Response,next:Nextfunction) =>{
    const bearer = req.headers.authorization 
    if(!bearer){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }
    const [, token] = bearer.split(' ')

    try {
        const decoded = jwt.verify(token, 'palabramegasecreata')
    } catch (error) {
        res.status(500).json(error: 'Token No Válido')
    }
    next()
}