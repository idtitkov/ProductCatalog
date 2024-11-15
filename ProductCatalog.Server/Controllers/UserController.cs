using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Models.Enums;
using ProductCatalog.Server.Services.Interfaces;
using System.Security.Claims;

namespace ProductCatalog.Server.Controllers;

[ApiController]
[Authorize(Roles = nameof(UserRole.Admin))]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        if (users == null || !users.Any())
        {
            return NotFound("No users found.");
        }

        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserModel user, [FromQuery] string password)
    {
        if (user == null || string.IsNullOrEmpty(password))
        {
            return BadRequest("User model and password are required.");
        }

        var result = await _userService.CreateUserAsync(user, password);
        if (result.Succeeded)
        {
            return CreatedAtAction(nameof(user), new { userId = user.Name }, user);
        }

        return BadRequest(result.Errors);
    }

    [HttpPut]
    public async Task<IActionResult> EditUser([FromBody] UserModel user, [FromQuery] string password)
    {
        if (user == null || string.IsNullOrEmpty(password))
        {
            return BadRequest("User model and password are required.");
        }

        var result = await _userService.EditUserAsync(user, password);
        if (result.Succeeded)
        {
            return NoContent();
        }

        return NotFound(result.Errors);
    }

    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == currentUserId)
        {
            return Forbid("User cannot delete itself.");
        }

        var result = await _userService.DeleteUserAsync(userId);
        if (result.Succeeded)
        {
            return NoContent();
        }

        return NotFound(result.Errors);
    }

    [HttpPost("{userId}/lock")]
    public async Task<IActionResult> LockUser(string userId)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == currentUserId)
        {
            return Forbid("User cannot lock itself.");
        }

        var result = await _userService.LockUserAsync(userId);
        if (result.Succeeded)
        {
            return NoContent();
        }

        return NotFound(result.Errors);
    }

    [HttpPost("{userId}/unlock")]
    public async Task<IActionResult> UnlockUser(string userId)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == currentUserId)
        {
            return Forbid("User cannot unlock itself.");
        }

        var result = await _userService.UnlockUserAsync(userId);
        if (result.Succeeded)
        {
            return NoContent();
        }

        return NotFound(result.Errors);
    }
}
