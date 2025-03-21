import { Controller, Post, Get, Put, Delete, Body, Route, Path } from "tsoa";
import Helper from "../utils/helper.utils";
import { inject, injectable } from "inversify";
import { IUserModel } from "../dto/user.model";
import IUserService from "../services/users.service";

@injectable()
@Route("api/user")
export class UserController extends Controller {

    constructor(
        @inject("Helper") private readonly helper: Helper,
        @inject("IUserService") private readonly userService: IUserService
    ) { super(); }

    /**
     * Define a POST endpoint with the body parameter 'IUserModel'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createUser(@Body() body: IUserModel): Promise<any> {

        try {

            // Await the result of the create method from the userService
            await this.userService.createUser(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { message: `User ${body.email} created successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { message: ex.message };

        }

    }

    /**
     * Define a GET endpoint to get all Users
     * @returns IUserModel[] | RequestResponse
     */
    @Get()
    public async getUsers(): Promise<any> {

        try {

            // Await the result of the gets method from the userService
            return await this.userService.getUsers();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { message: ex.message };

        }
    }

    /**
     * Gets a User by their id
     * @param _id 
     * @returns IUserModel | RequestResponse
     */
    @Get("/:_id")
    public async getUser(@Path() _id: string): Promise<any> {
        try {
            // Await the result of the get method from the UserService
            return await this.userService.getUser(_id);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { message: ex.message };
        }
    }

    /**
         * Define a PUT endpoint with the parameter '_id' and body parameter 'User'
         * @param _id 
         * @param body 
         * @returns RequestResponse
         */
    @Put("/:_id")
    public async updateUser(@Path() _id: string, @Body() body: IUserModel): Promise<any> {

        try {

            // Await the result of the update method from the UserService
            await this.userService.updateUser(_id, body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { message: `User updated successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { message: ex.message };

        }
    }

    /**
     * Delete a User by their _id
     * @param _id 
     * @returns RequestResponse
     */
    @Delete("/:_id")
    public async deleteUser(@Path() _id: string): Promise<any> {
        try {
            // Await the result of the get method from the UserService
            await this.userService.deleteUser(_id, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { message: `User deleted successfuly.` };

        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { message: ex.message };
        }
    }

}
