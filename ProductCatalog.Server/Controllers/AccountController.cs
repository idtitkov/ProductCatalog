using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Models.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProductCatalog.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ILogger<AccountController> logger) : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager = userManager;
    private readonly SignInManager<IdentityUser> _signInManager = signInManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<AccountController> _logger = logger;

    [HttpPost("register")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Validation Error",
                Detail = "Invalid input data.",
                Status = StatusCodes.Status400BadRequest,
                Extensions = { ["Errors"] = ModelState }
            });
        }

        var existingUser = await _userManager.FindByNameAsync(model.UserName);
        if (existingUser != null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "User Already Exists",
                Detail = "User Already Exists",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var user = new IdentityUser { UserName = model.UserName };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            if (await _roleManager.RoleExistsAsync(model.Role.ToString()))
            {
                await _userManager.AddToRoleAsync(user, model.Role.ToString());
            }
            else
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Role Not Found",
                    Detail = "Role Does Not Exist",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            return Ok(new { Message = "User registered successfully" });
        }

        var errors = result.Errors.Select(e => e.Description).ToList();
        return BadRequest(new ProblemDetails
        {
            Title = "Registration Failed",
            Detail = "Registration failed.",
            Status = StatusCodes.Status400BadRequest,
            Extensions = { ["Errors"] = errors }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        _logger.LogInformation("User {UserName} tried to log in", model.UserName);

        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Validation Error",
                Detail = "Invalid input data.",
                Status = StatusCodes.Status400BadRequest,
                Extensions = { ["Errors"] = ModelState }
            });
        }

        var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "User  Not Found",
                    Detail = "User  not found after successful login.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var token = await GenerateJwtToken(user);

            _logger.LogInformation("User {UserName} successfully logged in", model.UserName);
            return Ok(new { Token = token });
        }
        else if (result.IsLockedOut)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Account Locked",
                Detail = "Your account is locked due to multiple failed login attempts.",
                Status = StatusCodes.Status403Forbidden
            });
        }
        else if (result.IsNotAllowed)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Login Not Allowed",
                Detail = "Login is not allowed for this user.",
                Status = StatusCodes.Status403Forbidden
            });
        }

        return Unauthorized(new ProblemDetails
        {
            Title = "Invalid Credentials",
            Detail = "Username or password is incorrect.",
            Status = StatusCodes.Status401Unauthorized
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "User  Not Found",
                Detail = "The current user could not be found.",
                Status = StatusCodes.Status404NotFound
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        Enum.TryParse<UserRole>(roles.First(), true, out var role);

        var userModel = new UserModel
        {
            Id = user.Id,
            Name = user.UserName ?? string.Empty,
            Role = role,
            IsBlocked = await _userManager.IsLockedOutAsync(user)
        };

        return Ok(userModel);
    }

    private async Task<string> GenerateJwtToken(IdentityUser user)
    {
        ArgumentNullException.ThrowIfNull(nameof(user), "User  cannot be null.");

        var jwtSection = _configuration.GetSection("Jwt");
        var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new InvalidOperationException("JWT settings are not configured properly.");

        var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Name, user.UserName ?? user.Id.ToString()),
            };

        var roles = await _userManager.GetRolesAsync(user);
        if (roles != null)
        {
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
