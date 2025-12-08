using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using PreClear.Api.Data;
using PreClear.Api.Helpers;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly PreclearDbContext _db;
        private readonly IConfiguration _config;
        private readonly Microsoft.Extensions.Logging.ILogger<AuthService> _logger;
        public AuthService(PreclearDbContext db, IConfiguration config, Microsoft.Extensions.Logging.ILogger<AuthService> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }
        public async Task<(bool Success, string? Error, long? UserId)> SignUpAsync(User user, string password)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrWhiteSpace(user.Email)) return (false, "email_required", null);
                // Require simple email format: must contain @ and .com
                if (!user.Email.Contains('@') || !user.Email.ToLowerInvariant().Contains(".com"))
                    return (false, "invalid_email_format", null);
                if (string.IsNullOrWhiteSpace(password)) return (false, "password_required", null);

                // Enforce password rules
                var pwdError = ValidatePassword(password);
                if (pwdError != null) return (false, pwdError, null);

                // check uniqueness
                var existing = _db.Users.FirstOrDefault(u => u.Email == user.Email);
                if (existing != null) return (false, "email_taken", null);

                // Hash password
                var (salt, hash) = HashPassword(password);
                user.PasswordHash = Convert.ToBase64String(salt) + ":" + Convert.ToBase64String(hash);
                user.CreatedAt = user.UpdatedAt = DateTime.UtcNow;

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                return (true, null, user.Id);
            }
            catch (System.Exception ex)
            {
                // Log the exception to help troubleshooting (do not log password)
                _logger.LogError(ex, "Error while creating user {Email}", user?.Email);
                return (false, "server_error", null);
            }
        }

        public async Task<(bool Success, string? Token, string? Error, long? UserId, string? Role)> SignInAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return (false, null, "invalid_credentials",null,null);

            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return (false, null, "invalid_credentials", null, null);

            if (!VerifyPassword(password, user.PasswordHash)) return (false, null, "invalid_credentials", null, null);

            // Create JWT
            var jwtKey = _config["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");
            if (string.IsNullOrEmpty(jwtKey)) return (false, null, "jwt_key_not_configured", null, null);

            var claims = new[] {
                new System.Collections.Generic.KeyValuePair<string,string>("sub", user.Id.ToString()),
                new System.Collections.Generic.KeyValuePair<string,string>("email", user.Email),
                new System.Collections.Generic.KeyValuePair<string,string>("role", user.Role ?? "")
            };

            var token = JwtTokenGenerator.GenerateToken(claims, jwtKey, 60 * 24 * 7); // 7 days
            return (true, token, null, user.Id, user.Role);
        }

        private static string? ValidatePassword(string password)
        {
            if (password == null) return "password_required";
            if (password.Length < 8) return "password_too_short";
            if (!password.Any(char.IsDigit)) return "password_needs_digit";
            if (!password.Any(ch => "!@#$%^&*()-_+=[]{}|;:'\",.<>?/`~".Contains(ch))) return "password_needs_symbol";
            return null;
        }

        private static (byte[] Salt, byte[] Hash) HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var deriveBytes = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            var hash = deriveBytes.GetBytes(32);
            return (salt, hash);
        }

        private static bool VerifyPassword(string password, string stored)
        {
            try
            {
                var parts = stored.Split(':');
                if (parts.Length != 2) return false;
                var salt = Convert.FromBase64String(parts[0]);
                var expectedHash = Convert.FromBase64String(parts[1]);

                using var deriveBytes = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
                var actualHash = deriveBytes.GetBytes(expectedHash.Length);
                return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
            }
            catch
            {
                return false;
            }
        }
    }
}
