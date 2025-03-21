import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../db/dbsession.db";
import Helper from "../utils/helper.utils";
import { IUserModel } from "../dto/user.model";
import IUserRepository from "../repositories/user.repository";
import UserSchema, { IUserSchema } from "../dao/user.db";

// Interface for IUserService
export default interface IUserService {
    // Method to create a new user
    createUser(user: IUserModel, dbSession: ClientSession | undefined): Promise<IUserModel>;

    // Method to fetch all users
    getUsers(): Promise<IUserModel[]>;

    // Method to fetch a user by its id
    getUser(_id: string): Promise<IUserModel>;

    // Method to update a user by its id
    deleteUser(_id: string, session: ClientSession | undefined): Promise<boolean>;

    // Method to update a user by its id
    updateUser(_id: string, user: IUserModel, session: ClientSession | undefined): Promise<IUserModel>;
}

// This decorator ensures that UserService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UserService implements IUserService {
    // Injecting the UserRepository service
    constructor(
        @inject('Helper') private readonly helper: Helper,
        @inject('IUserRepository') private readonly userRepository: IUserRepository
    ) { }

    // Method to create a new user
    public async createUser(user: IUserModel, dbSession: ClientSession | undefined): Promise<IUserModel> {

        // Create new user schema object
        let newItem: IUserSchema = new UserSchema();

        // Map user model into schema object
        newItem = this.helper.DataMapper(user, newItem);

        // Check if the user is exists. If yes, throw an error.
        const isExist = await this.userRepository.isExistById(user.email);
        if (isExist) {
            throw new Error(`Provided user '${user.email}' is already exist`);
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create user document
        const results: IUserModel = await this.userRepository.create(newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Fetches all users from the database.
    public async getUsers(): Promise<IUserModel[]> {
        return await this.userRepository.gets();
    }

    // Gets a user by their id
    public async getUser(_id: string): Promise<IUserModel> {
        // Check if the User exists. If not, throw an error.
        const isExist = await this.userRepository.isExistById(_id);
        if (!isExist) {
            throw new Error(`Provided User does not exist`);
        }
        // Retrieve and return the User's information
        return await this.userRepository.get(_id);
    }

    // Updates an existing User  by their userName and returns the updated User.
    public async updateUser(_id: string, user: IUserModel, dbSession: ClientSession | undefined): Promise<IUserModel> {

        // Create new User schema object
        let newItem: IUserSchema = new UserSchema();

        // Map user model into schema object
        newItem = this.helper.DataMapper(user, newItem);

        // Check if the User exists. If not, throw an error.
        const isExist = await this.userRepository.isExistById(_id);
        if (!isExist) {
            throw new Error(`Provided User does not exist`);
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // User user document
        const results: IUserModel = await this.userRepository.update(_id, newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes a User by their id.
    public async deleteUser(_id: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the User exists. If not, throw an error.
        const isExist = await this.userRepository.isExistById(_id);
        if (!isExist) {
            throw new Error(`Provided user does not exist`);
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: boolean = await this.userRepository.delete(_id, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
