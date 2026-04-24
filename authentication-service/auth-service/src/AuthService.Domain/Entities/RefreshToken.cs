using System;

namespace AuthService.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string TokenHash { get; set; } = string.Empty;  // SHA-256 hex
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public Guid FamilyId { get; set; }        // agrupa la sesión
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsRevoked => RevokedAt.HasValue;
        public bool IsActive => !IsExpired && !IsRevoked;
    }
}
