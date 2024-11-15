using ProductCatalog.Server.Models.Enums;

namespace ProductCatalog.Server.Models;
public class RegisterModel
{
    public required string UserName { get; set; }

    public required string Password { get; set; }

    public required UserRole Role { get; set; }
}
