import { SetMetadata } from '@nestjs/common';
import { Role } from '@/src/enum/role.enum'; // or relative path: '../../enum/role.enum'

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
