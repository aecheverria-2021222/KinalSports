using System;
using System.ComponentModel.DataAnnotations;
using AuthService.Domain.Constants;

namespace AuthService.Domain.Entities;

/*Sirve para ser pivote entre user y rol*/
public class UserRole
{
    [Key]
    [MaxLength(16)]
    public string Id{get; set;}= string.Empty;

    /*ID de User*/
    [Key]
    [MaxLength(16)]
    public string UserId{get; set;}= string.Empty;

    /*ID de Rol*/
    [Key]
    [MaxLength(16)]
    public string RoleId {get; set;}= string.Empty;

    /*Cuando se crea o se edita*/ 
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    /*Hacer referencia hacia la otra entidad*/
    /*Cuando sea uno es objeto, si es muchos es array*/

    /*UserRol tiene que recibir objeto de tipo User (Relacion Cruzada)*/
    public User User {get; set;} = null!;/*El ! Puede o no puede ser null, osea caso omiso*/

    public Role Role {get; set;} = null!;

}
