using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class User
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;}= string.Empty;
    
    /*Nombre*/
    [Required(ErrorMessage ="El nombre es obligatorio")]
    [MaxLength(25, ErrorMessage ="El nombre no puede tener más de 25 caracteres")]
    public string Name {get; set;} = string.Empty;

    /*Apellido*/
    [Required(ErrorMessage ="El apellido es obligatorio")]
    [MaxLength(25, ErrorMessage ="El apellido no puede tener más de 25 caracteres")]
    public string Surname {get; set;} = string.Empty;

    /*Username*/
    [Required(ErrorMessage ="El username es obligatorio")]
    [MaxLength(25, ErrorMessage ="El username no puede tener más de 25 caracteres")]
    public string Username {get; set;} = string.Empty;

    /*Correo*/
    [Required(ErrorMessage ="El email es obligatorio")]
    [EmailAddress(ErrorMessage ="El email no tiene el formato correcto")]
    [MaxLength(150, ErrorMessage ="El email no puede tener más de 150 caracteres")]
    public string Email {get; set;} = string.Empty;

    /*Contraseña*/
    [Required(ErrorMessage ="La contraseña es obligatoria")]
    [MinLength(8, ErrorMessage ="La contraseña debe de tener al menos 8 caracteres")]
    [MaxLength(255, ErrorMessage ="La contraseña no puede tener más de 255 caracteres")]
    public string Password {get; set;} = string.Empty; 

    /*Softdelete*/
    public bool Status{get; set;} = false;  

    /*Cuando se crea o se edita*/ 
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    /*User tiene que recibir una coleccion de tipo UserRol (Relacion Cruzada)*/
    public ICollection<UserRole> UserRoles {get; set;}= [];

    public UserProfile UserProfile {get; set;} = null!;

    public UserEmail UserEmail {get; set;} = null!;

    public UserPasswordReset UserPasswordReset {get; set;} = null!;

    /*De uno a muchos; el uno recibe el array y el mucho recibe el objeto*/
}
