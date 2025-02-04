// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {} // Roles permitidos se pasan al crear el guard

  canActivate(context: ExecutionContext): boolean {
    // Obtiene el usuario desde el JWT (ya autenticado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verifica si el usuario tiene un rol permitido
    const hasRole = this.allowedRoles.includes(user?.role);

    if (!hasRole) {
      throw new ForbiddenException('Acceso denegado: Rol no autorizado');
    }

    return true;
  }
}