export interface Dictionary<T> {
    [id: string]: T;
}

export class StringHelper {
    static capitalize(value: string): string {
        if (!value || value.length == 0) {
            return "";
        }

        return value[0].toUpperCase() + value.substr(1)
    }
}