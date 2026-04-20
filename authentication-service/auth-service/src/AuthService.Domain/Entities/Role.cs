using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;
/*Plantilla para crear los rol*/
public class Role
{
    /*Iniciando con un atributo vacio*/
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Required(ErrorMessage ="El nombre del rol es obligatorio.")]/*Que sea necesario poner el nombre*/
    [MaxLength(35,ErrorMessage ="El nombre no puede exceder 35 caracteres.")]/*Para que no exceda los caracteres*/
    public string Name{get; set;} = string.Empty;

    /*Para que quede registro cuando se creo la tupla*/
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    /*Para que quede registro cuando se actualiza la tupla*/
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles {get; set;}=[];

}
