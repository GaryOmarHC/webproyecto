import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/create-account',
    //Validacion del nombre
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),

    //Validacion del password
    body('password')
        .isLength({ min: 10 }).withMessage('El password es muy corto, mínimo 10 caracteres')
        .matches(/(?=.*[A-Z])/).withMessage('El password debe contener al menos una letra mayúscula')
        .matches(/(?=.*[!@#$%^&*.])/).withMessage('El password debe contener al menos un símbolo')
        .matches(/(?=.*\d)/).withMessage('El password debe contener al menos un número'),

    //Confirmacion del password
    body('password_confirmation').custom((value, {req}) =>{
        if(value!== req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true    
    }),

    //Validacion del password
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    
    //Midelware para manejar errores
    handleInputErrors,

    //Llamada al controlador para crear la cuenta
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
    .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)
  
router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),  
    body('password')
        .notEmpty().withMessage('El password no puede ser vacio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no válido'),  

    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no válido'),  

    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
    .isNumeric().withMessage('Token no válido'),
    
    body('password')
        .isLength({ min: 10 }).withMessage('El password es muy corto, mínimo 10 caracteres')
        .matches(/(?=.*[A-Z])/).withMessage('El password debe contener al menos una letra mayúscula')
        .matches(/(?=.*[!@#$%^&*.])/).withMessage('El password debe contener al menos un símbolo')
        .matches(/(?=.*\d)/).withMessage('El password debe contener al menos un número'),

    //Confirmacion del password
    body('password_confirmation').custom((value, {req}) =>{
        if(value!== req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true    
    }),

    handleInputErrors,
    AuthController.updatePasswordWithToken
)



export default router