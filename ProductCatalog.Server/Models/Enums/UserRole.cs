using System.Text.Json.Serialization;

namespace ProductCatalog.Server.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Admin,
    User,
    SuperUser,
}
