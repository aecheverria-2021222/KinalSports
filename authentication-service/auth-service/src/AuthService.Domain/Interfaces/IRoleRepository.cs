using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string roleName);
    Task<int> CountUsersInRoleAsync(string roleName);
    Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName);
    Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId);
}
