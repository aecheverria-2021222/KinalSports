namespace AuthService.Application.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; } = 900;
    // Compact user details for clients
    public UserDetailsDto UserDetails { get; set; } = new();
}
