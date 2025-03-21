import { Controller, Get, Route } from "tsoa";
import Helper from "../utils/helper.utils";
import { inject, injectable } from "inversify";

@injectable()
@Route("api/test")
export class TestController extends Controller {

    constructor(
        @inject("Helper") private readonly helper: Helper
    ) { super(); }

    @Get()
    public async getMethod(): Promise<{ message: string }> {
        try {
            // Set the HTTP status to 200 (OK)
            this.setStatus(200);

            // Return the success response
            return { message: "This is a test method from TestController API." + this.helper.HelperTest() };
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);

            // Return an error message
            return { message: ex.message };
        }
    }

}
