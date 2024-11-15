import { UserRole } from "./user-role.model";

export interface User {
    id: string;
    name: string;
    role: UserRole;
    isBlocked: boolean;
}
