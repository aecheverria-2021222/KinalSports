using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    Task<string> GenerateTokenAsync(string userId, int expiresInMinutes = 15);
}
