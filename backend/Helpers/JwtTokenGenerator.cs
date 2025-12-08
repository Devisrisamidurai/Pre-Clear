using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace PreClear.Api.Helpers
{
    public static class JwtTokenGenerator
    {
        // Generate a JWT using a symmetric secret key
        public static string GenerateToken(IEnumerable<KeyValuePair<string, string>> claims, string secretKey, int expiresMinutes = 60)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtClaims = new List<Claim>();
            foreach (var kv in claims)
            {
                jwtClaims.Add(new Claim(kv.Key, kv.Value));
            }

            var token = new JwtSecurityToken(
                claims: jwtClaims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
