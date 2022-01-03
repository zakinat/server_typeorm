import * as joi from "joi"

export const userSchemaRegister={
    firstName: joi.string().required().max(250).min(3),
    lastName: joi.string().required().max(250).min(3),
    password: joi.string().required().min(5).max(15),
    email: joi.string().email().required().max(250).min(4),
    dateOfBirth: joi.string().optional().min(5).max(50),
}
