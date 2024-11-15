namespace ProductCatalog.Server.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public float Price { get; set; }
    public string? Note { get; set; } = string.Empty;
    public string? SpecialNote { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }
}
