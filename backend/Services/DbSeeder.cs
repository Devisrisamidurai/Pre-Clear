using System;
using System.Linq;
using PreClear.Api.Data;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public static class DbSeeder
    {
        public static void Seed(PreclearDbContext db)
        {
            // safe check
            if (db.Users.Any(u => u.Email == "shipper@test.com")) return;

            db.Users.AddRange(
                new User {
                    FirstName = "Test",
                    LastName = "Shipper",
                    Email = "shipper@test.com",
                    PasswordHash = "$2b$12$r1z6P5Q7Pz7P9SgZJ9vY4eE1SMwZfJ6O7xH5iY4bPclh2MufwHkSy",
                    Role = "shipper",
                    Phone = "+91-9876543210",
                    Company = "Test Exports Pvt Ltd",
                    TosAccepted = true,
                    TosAcceptedAt = DateTime.UtcNow,
                    EmailVerified = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User {
                    FirstName = "Demo",
                    LastName = "Broker",
                    Email = "broker@test.com",
                    PasswordHash = "$2b$12$r1z6P5Q7Pz7P9SgZJ9vY4eE1SMwZfJ6O7xH5iY4bPclh2MufwHkSy",
                    Role = "broker",
                    Phone = "+1-415-555-0199",
                    Company = "Global Customs Brokers LLC",
                    TosAccepted = true,
                    TosAcceptedAt = DateTime.UtcNow,
                    EmailVerified = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User {
                    FirstName = "System",
                    LastName = "Admin",
                    Email = "admin@test.com",
                    PasswordHash = "$2b$12$r1z6P5Q7Pz7P9SgZJ9vY4eE1SMwZfJ6O7xH5iY4bPclh2MufwHkSy",
                    Role = "admin",
                    Phone = "+1-800-742-5877",
                    Company = "UPS Operations",
                    TosAccepted = true,
                    TosAcceptedAt = DateTime.UtcNow,
                    EmailVerified = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            db.SaveChanges();
        }
    }
}
