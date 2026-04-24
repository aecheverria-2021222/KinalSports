using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class UserProfile
{
    [Key]
    [MaxLength(16)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(16)]
    public string UserId { get; set; } = string.Empty;

    [MaxLength(512)]
    public string ProfilePicture { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 8, ErrorMessage = "El número de teléfono debe tener exactamente 8 dígitos.")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "El teléfono solo debe contener números.")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public User User { get; set; } = null!;
}
