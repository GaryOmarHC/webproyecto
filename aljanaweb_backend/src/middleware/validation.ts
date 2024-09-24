import type { Request, Response, NextFuntion } from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req : Request, res:  Response, next : NextFuntion ) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    next()
}