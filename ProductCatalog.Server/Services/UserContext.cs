using ProductCatalog.Server.Models.Enums;
using ProductCatalog.Server.Services.Interfaces;
using System.Security.Claims;

namespace ProductCatalog.Server.Services;

public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));

    public bool IsInRole(UserRole role)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user == null ? throw new UnauthorizedAccessException("User is not authenticated.") : user.IsInRole(role.ToString());
    }

    public string? GetUserId()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user == null
            ? throw new UnauthorizedAccessException("User is not authenticated.")
            : (user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}
