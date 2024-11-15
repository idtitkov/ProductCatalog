using Microsoft.AspNetCore.Identity;
using ProductCatalog.Server.Models;

namespace ProductCatalog.Server.Services.Interfaces;

public interface IUserService
{
    Task<IList<UserModel>> GetAllUsersAsync();
    Task<IdentityResult> CreateUserAsync(UserModel user, string password);
    Task<IdentityResult> EditUserAsync(UserModel user, string password);
    Task<IdentityResult> DeleteUserAsync(string userId);
        Task<IdentityResult> LockUserAsync(string userId);
    Task<IdentityResult> UnlockUserAsync(string userId);
}
