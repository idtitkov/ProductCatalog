namespace ProductCatalog.Server.DTOs;

public class ProductDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public float Price { get; set; }
    public string? Note { get; set; }
    public string? SpecialNote { get; set; }
    public required CategoryDTO Category { get; set; }
}
