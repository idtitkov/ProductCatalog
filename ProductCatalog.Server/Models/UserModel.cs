using ProductCatalog.Server.Models.Enums;

namespace ProductCatalog.Server.Models;

public class UserModel
{
    public string? Id { get; set; }
    public required string Name { get; set; }
    public required UserRole Role { get; set; }
    public bool IsBlocked { get; set; }
}
