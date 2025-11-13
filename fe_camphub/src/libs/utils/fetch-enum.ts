import { UserType } from "../constants";


export const userTypeOptions = [
    ...Object.keys(UserType).map((key) => ({
        value: UserType[key as keyof typeof UserType],
        label: UserType[key as keyof typeof UserType],
    })),
];