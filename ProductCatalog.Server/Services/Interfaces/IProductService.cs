using ProductCatalog.Server.DTOs;

namespace ProductCatalog.Server.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductDTO>> GetAllProductsAsync();
    Task<ProductDTO?> GetProductByIdAsync(int id);
    Task<ProductDTO> CreateProductAsync(ProductDTO productDto);
    Task<ProductDTO?> UpdateProductAsync(int id, ProductDTO productDto);
    Task DeleteProductAsync(int id);
}
