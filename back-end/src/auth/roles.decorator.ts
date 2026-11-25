
import { Reflector } from '@nestjs/core';

export type RolesType = 'admin' | 'student' | 'particular';
export const Roles = Reflector.createDecorator<RolesType[]>();
