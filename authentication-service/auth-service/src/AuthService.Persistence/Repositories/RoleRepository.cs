using System;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;


namespace AuthService.Persistence.Repositories;

public class RoleRepository(ApplicationDbContext context) : IRoleRepository
{
    /*En una interfaz se tienen que poner todos sus metodos*/
    public async Task<int> CountUsersRoleAsync(string roleName)
    {
        return await context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.Role.Name== roleName)
            .Select(ur => ur.UserId)
            .Distinct()
            .CountAsync();/*Devuelve entero*/
    }

    public async Task<Role?> GetByNameAsync(string roleName)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
    }

    public async Task<IReadOnlyList<string>> GetUsersByRoleAsync(string userId)
    {
        return await context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role.Name)
            .ToListAsync();/*Devuelve lista*/
    }

    public async Task<IReadOnlyList<User>> GetUsersAsync(string roleName)
    {
        var users = await context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserEmail)
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Where(u => u.UserRoles.Any(Ur => Ur.Role.Name == roleName))
            .ToListAsync();

        return users;
    }

    public Task<int> CountUsersInRoleAsync(string roleName)
    {
        throw new NotImplementedException();
    }

    Task<IReadOnlyList<User>> IRoleRepository.GetUsersByRoleAsync(string roleName)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId)
    {
        throw new NotImplementedException();
    }
}
