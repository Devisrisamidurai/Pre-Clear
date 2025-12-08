namespace PreClear.Api.Interfaces
{
    public interface IAuthService
    {
        System.Threading.Tasks.Task<(bool Success, string? Error, long? UserId)> SignUpAsync(PreClear.Api.Models.User user, string password);
        System.Threading.Tasks.Task<(bool Success, string? Token, string? Error, long? UserId, string? Role)> SignInAsync(string email, string password);
    }
}
