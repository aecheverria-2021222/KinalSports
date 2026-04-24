namespace AuthService.Application.DTOs;

public record RefreshResponseDto(string AccessToken, string RefreshToken, int ExpiresIn);
