using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Models.Enums;
using ProductCatalog.Server.Services.Interfaces;

namespace ProductCatalog.Server.Services;

public class UserService(UserManager<IdentityUser> userManager) : IUserService
{
    private readonly UserManager<IdentityUser> _userManager = userManager;

    public async Task<IList<UserModel>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();

        var userModels = new List<UserModel>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var userModel = new UserModel
            {
                Id = user.Id,
                Name = user.UserName ?? string.Empty,
                Role = Enum.TryParse<UserRole>(roles.First(), true, out var role) ? role : UserRole.User,
                IsBlocked = user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow
            };

            userModels.Add(userModel);
        }

        return userModels;
    }

    public async Task<IdentityResult> CreateUserAsync(UserModel user, string password)
    {
        if (string.IsNullOrEmpty(user.Name))
        {
            throw new ArgumentException("Username cannot be null or empty.", nameof(user));
        }

        var newUser = new IdentityUser
        {
            UserName = user.Name,
        };

        var result = await _userManager.CreateAsync(newUser, password);
        await _userManager.AddToRoleAsync(newUser, user.Role.ToString());
        return result;
    }

    public async Task<IdentityResult> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            return await _userManager.DeleteAsync(user);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found." });
    }

    public async Task<IdentityResult> LockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            user.LockoutEnd = DateTimeOffset.MaxValue;
            return await _userManager.UpdateAsync(user);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found." });
    }

    public async Task<IdentityResult> UnlockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            user.LockoutEnd = null;
            return await _userManager.UpdateAsync(user);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found." });
    }

    public async Task<IdentityResult> EditUserAsync(UserModel editedUser, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(editedUser.Id);
        if (user == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "User not found." });
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, roles);
        await _userManager.AddToRoleAsync(user, editedUser.Role.ToString());

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        return result;
    }
}
