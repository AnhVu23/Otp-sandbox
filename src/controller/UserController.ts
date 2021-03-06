/**
 * Created by Hai Anh on 3/5/20
 */

import {Response} from 'express'
import {
    Body,
    JsonController,
    Post,
    Res,
} from 'routing-controllers'
import {Connection, getConnection, Repository} from 'typeorm'
import * as uuidv4 from 'uuid/v4'
import {User} from '../entity'
import {errorHelper} from '../helpers/ErrorHelper'

@JsonController()
export class UsersController {
    private users: Repository<User>
    private conn: Connection

    constructor() {
        this.conn = getConnection()
        this.users = this.conn.getRepository(User)
    }

    /**
     *
     * @api {POST} users Create new owner
     * @apiName createUser
     * @apiGroup user
     * @apiVersion 1.0.0
     *
     * @apiParam  {String} [firstName] user's first name
     * @apiParam  {String} [lastName] user's last name
     * @apiParam  {String} [email] user's email
     * @apiParam  {String} [phoneNumber] user's phone number
     * @apiParam  {String} [password] user's password
     * @apiParam  {String} [address] user's street address
     * @apiParam  {String} [postalCode] user's postal code
     * @apiParam  {String} [city] user's city
     * @apiParam  {License}[license] user's license
     * @apiParam  {Company} [company] user's company
     * @apiParam  {File} [avatar] user's avatar
     * @apiParam  {userLanguages} [userLanguages] user's languages
     *
     * @apiParamExample  {type} Request-Example:
     *  {
     *    "firstName": "Arttu",
     *    "lastName": "Arponen",
     *    "email" : "arttu@vertics.co",
     *    "password": "password",
     *    "phoneNumber": "0443339799",
     *    "address": "Otakaari 5",
     *    "postalCode": "02510",
     *    "city": "Espoo",
     *    "license": {
     *        "id": 3
     *    },
     *    "companies":[{
     *        "id": 4
     *    }]
     *    ,
     *    avatar: {
     *        "id": 7
     *    },
     *    languages: [{
     *        "languageId": 1,
     *        "skillLevel": 3
     *    }, {
     *        "languageId": 2,
     *        "skillLevel": 4
     *    }]
     *  }
     *
     * @apiSuccessExample {type} Success-Response:
     * {
     *  "status": 'Created'
     * }
     *
     */
    @Post('/users')
    public async createDriver(@Body({required: true, validate: true}) post: User, @Res() res: Response) {
        try {
            const newUser = new User()
            newUser.email = post.email
            newUser.phoneNumber = post.phoneNumber
            const randomPassword = uuidv4()
            await newUser.setPassword(randomPassword)
            const userInsertRes = await this.users.save(newUser)
            return res.status(201).send({message: 'Created', user: userInsertRes})
        } catch (error) {
            errorHelper(error, error.message)
        }
    }
}
