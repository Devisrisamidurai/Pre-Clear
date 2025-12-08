using System.Text.Json;

namespace PreClear.Api.Models
{
    public class User
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Name { get; private set; } = null!; // computed
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "shipper";
        public string Phone { get; set; } = null!;
        public string Company { get; set; } = null!;

        public bool TosAccepted { get; set; }
        public DateTime? TosAcceptedAt { get; set; }
        public bool EmailVerified { get; set; }
        public string? VerificationToken { get; set; }

        public string? InviteCode { get; set; }
        public DateTime? InviteExpiresAt { get; set; }

        public bool IsActive { get; set; } = true;
        public JsonDocument? Metadata { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
