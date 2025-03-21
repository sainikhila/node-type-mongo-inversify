import { injectable } from "inversify";

export interface IUserModel {
    name: string;
    email: string;
}

@injectable()
export class UserModel implements IUserModel {

    name: string;
    email: string;

}