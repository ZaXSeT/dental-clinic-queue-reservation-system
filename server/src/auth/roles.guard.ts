import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No roles required, public access
        }

        const { user } = context.switchToHttp().getRequest();

        // Logic: Check if user exists and has matching role
        // For now, assume user is attached to request by a previous AuthGuard (JWT)
        if (!user) return false;

        return requiredRoles.some((role) => user.role?.includes(role));
    }
}
