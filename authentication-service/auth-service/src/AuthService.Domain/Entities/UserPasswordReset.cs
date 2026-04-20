using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class UserPasswordReset
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Key]
    [MaxLength(16)]
    public string UserId {get; set;} = string.Empty;

    [MaxLength(255)]
    public string? PasswordResetToken {get; set;}/*? es para que el string se habilite hasta que alguien lo use*/

    public DateTime? PasswordResetTokenExpiry {get; set;}

    public User User {get; set;} = null!;

    
}
