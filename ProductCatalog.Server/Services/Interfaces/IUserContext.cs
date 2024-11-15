using ProductCatalog.Server.Models.Enums;

namespace ProductCatalog.Server.Services.Interfaces;

public interface IUserContext
{
    bool IsInRole(UserRole role);

    string? GetUserId();
}
