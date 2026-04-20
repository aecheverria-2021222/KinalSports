using System;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

/*Dos clases diferentes funciones de manera adecuada para que se relaciomes*/
/*Permiter tener acciones especificas, definir un metodo pero no su implementacion*/

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string roleName);/*Obtener el nombre, con el nombre del rol*/

    Task<int> CountUsersInRoleAsync(string roleName);/*Cuantos usarios hay en un rol con el nombre del rol*/

    Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName);/*Devolver una lista de solo lectura, que usuarios tiene el rol especifico*/

    Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId);/*Devolver que rol tiene el Idusuario*/


}
