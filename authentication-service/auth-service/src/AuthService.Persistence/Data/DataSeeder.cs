using System;
using System.Collections.Generic;
using AuthService.Domain.Entities;
using AuthService.Domain.Constants;
using AuthService.Application.Services;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Misc;

namespace AuthService.Persistence.Data;

public class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!context.Roles.Any())
        {
            var roles = new List<Role>
            {
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.ADMIN_ROLE
                },
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.USER_ROLE
                }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        if(!await context.Users.AnyAsync())
        {
            // Buscamos ambos roles
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.ADMIN_ROLE);
            var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.USER_ROLE);

            if(adminRole != null && userRole != null)
            {
                var passwordHasher = new PasswordHashService();
                
                // ==========================================
                // 1. CREACIÓN DEL USUARIO ADMINISTRADOR
                // ==========================================
                var adminUserId = UuidGenerator.GenerateUserId();
                var adminProfileId = UuidGenerator.GenerateUserId();
                var adminEmailId = UuidGenerator.GenerateUserId();
                var adminUserRoleId = UuidGenerator.GenerateUserId();

                var adminUser = new User
                {
                    Id = adminUserId,
                    Name = "Admin Name",
                    Surname = "Admin Surname",
                    Username = "admin",
                    Email = "admin@local.com",
                    Password = passwordHasher.HashPassword("Kinal2026!"),
                    Status = true,

                    UserProfile = new UserProfile
                    {
                        Id = adminProfileId,
                        UserId = adminUserId,
                        ProfilePicture = string.Empty,
                        Phone = "00000000"
                    },

                    UserEmail = new UserEmail
                    {
                        Id = adminEmailId,
                        UserId = adminUserId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },

                    UserRoles = new List<UserRole>
                    {
                        new UserRole
                        {
                            Id = adminUserRoleId,
                            UserId = adminUserId,
                            RoleId = adminRole.Id // Rol de Admin
                        }
                    }
                };
                
                await context.Users.AddAsync(adminUser);

                // ==========================================
                // 2. CREACIÓN DEL USUARIO ESTÁNDAR
                // ==========================================
                var standardUserId = UuidGenerator.GenerateUserId();
                var standardProfileId = UuidGenerator.GenerateUserId();
                var standardEmailId = UuidGenerator.GenerateUserId();
                var standardUserRoleId = UuidGenerator.GenerateUserId();

                var standardUser = new User
                {
                    Id = standardUserId,
                    Name = "Standard",
                    Surname = "User",
                    Username = "user",
                    Email = "user@local.com",
                    Password = passwordHasher.HashPassword("Usuario2026!"), // Contraseña por defecto
                    Status = true, // Para que no necesite correo de activación

                    UserProfile = new UserProfile
                    {
                        Id = standardProfileId,
                        UserId = standardUserId,
                        ProfilePicture = string.Empty,
                        Phone = "11111111"
                    },

                    UserEmail = new UserEmail
                    {
                        Id = standardEmailId,
                        UserId = standardUserId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },

                    UserRoles = new List<UserRole>
                    {
                        new UserRole
                        {
                            Id = standardUserRoleId,
                            UserId = standardUserId,
                            RoleId = userRole.Id // Rol de Usuario Normal
                        }
                    }
                };

                await context.Users.AddAsync(standardUser);

                // Guardamos ambos usuarios en la base de datos
                await context.SaveChangesAsync();
            }
        }
    }
}