namespace AuthService.Application.DTOs.Email;

public class EmailResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    // Datos adicionales opcionales (por ejemplo, email verificado, token info, etc.)
    public object? Data { get; set; }
}
