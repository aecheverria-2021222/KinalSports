using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByHashAsync(string tokenHash);
    Task<IEnumerable<RefreshToken>> GetByFamilyIdAsync(Guid familyId);
    Task AddAsync(RefreshToken token);
    Task RevokeAsync(RefreshToken token);
    Task RevokeFamilyAsync(Guid familyId);
    Task SaveChangesAsync();
}
