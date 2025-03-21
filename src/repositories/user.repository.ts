import { ClientSession, Error } from "mongoose";
import { injectable, inject } from "inversify";
import Helper from "../utils/helper.utils";
import UserSchema, { IUserSchema } from "../dao/user.db";
import DbSession from "../db/dbsession.db";

// Interface for UserRepository
export default interface IUserRepository {

    // Method to create a new user
    create(user: IUserSchema, session: ClientSession | undefined): Promise<IUserSchema>;

    // Method to check if a user exists by its email
    isExistByEmail(email: string): Promise<boolean>;

    // Method to check if a user exists by its id
    isExistById(_id: string): Promise<boolean>;

    // Method to fetch all users
    gets(): Promise<IUserSchema[]>;

    // Method to fetch a user by its id
    get(_id: string): Promise<IUserSchema>;

    // Method to update a user by its id
    delete(_id: string, session: ClientSession | undefined): Promise<boolean>;

    // Method to update a user by its id
    update(_id: string, user: IUserSchema, session: ClientSession | undefined): Promise<IUserSchema>;

}

// This decorator ensures that UserRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UserRepository implements IUserRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private readonly helper: Helper) { }

    // Method to check if a user exists by its email
    public async isExistByEmail(email: string): Promise<boolean> {
        return await UserSchema.find({ email }, { _id: 1 })
            .then((data: IUserSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                const results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to check if a user exists by its id
    public async isExistById(_id: string): Promise<boolean> {
        return await UserSchema.find({ _id }, { _id: 1 })
            .then((data: IUserSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                const results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to create a new user
    public async create(useer: IUserSchema, session: ClientSession | undefined): Promise<any> {

        // create the useer document with the new data.
        return await UserSchema.create([useer], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                const results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Handle any errors that occur during the creation
                throw error;
            });
    }

    // Fetches a all existing users
    public async gets(): Promise<IUserSchema[]> {

        return await UserSchema.find({}, { __v: 0 })
            .then((data: IUserSchema[]) => {
                // Uses the helper to process the UserSchema.
                const results = this.helper.GetItemFromArray(data, -1, []);
                return results as IUserSchema[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches a single user by its id.
    public async get(_id: string): Promise<IUserSchema> {

        return await UserSchema.find({ _id }, { __v: 0 })
            .then((data: IUserSchema[]) => {
                // Uses the helper to process the UserSchema.
                const results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });

    }

    // Deletes a user by its id.
    public async delete(_id: string, session: ClientSession | undefined): Promise<boolean> {
        return await UserSchema.findOneAndDelete({ _id }, { session })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Handle any errors that occur during the creation
                throw error;
            });
    }

    // Updates a users's information based on the provided user id.
    public async update(_id: string, user: IUserSchema, session: ClientSession | undefined): Promise<IUserSchema> {

        // Remove new id while updating the collection
        user = JSON.parse(JSON.stringify(user));
        delete user['_id'];

        // Find and update the user document with the new data.
        return await UserSchema.findOneAndUpdate({ _id }, user, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                const results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IUserSchema object.
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throw an error if the update operation fails.
                throw error;
            });
    }
}
