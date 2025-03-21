import { injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export default class Helper {

    constructor() { }

    public HelperTest(): string {
        return "This is helper test class";
    }

    public IsNull(e: any): boolean {
        return e === undefined || e === null;
    }

    public IsNullValue(e: any): boolean {
        return e === undefined || e === null || e === "" || e === "undefined";
    }

    public IsArrayNull(e: any): boolean {
        if (this.IsNull(e)) return true;
        return e.length === 0;
    };

    public ChangeToExactDecimal(v: any): void {
        if (v !== null && typeof v === "object") {
            Object.entries(v).forEach(([key]) => {
                if (v[key] && v[key].constructor.name === "Decimal128") {
                    if (!this.IsNullValue(v[key])) {
                        v[key] = parseFloat(v[key]);
                    }
                }
            });
        }
    };

    public SetToJSON(v: any): void {
        if (!this.IsNullValue(v)) {
            v.set("toJSON", {
                getters: true,
                transform: (_, ret: any) => {
                    this.ChangeToExactDecimal(ret);
                    delete ret.__v;
                    delete ret.id;
                    return ret;
                },
            });
        }
    };

    public GetItemFromArray(arr: any, pos: number, defa: any): any {
        if (!this.IsArrayNull(arr)) {
            return pos > -1 ? arr[pos] : arr;
        }
        return defa;
    };

    public CloneObject(x: any): any {
        if (!this.IsNullValue(x)) {
            return JSON.parse(JSON.stringify(x));
        }
        return null;
    }

    public ObjectId(id: any): any {
        return Types.ObjectId.createFromTime(id);
    };

    public DataMapper<T>(item: Partial<T>, newItem: T): T {
        Object.keys(item).forEach((key) => {
            if (item[key as keyof T] !== undefined) {
                newItem[key as keyof T] = item[key as keyof T]!;
            }
        });
        return newItem;
    }
}