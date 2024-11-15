using ProductCatalog.Server.DTOs;

namespace ProductCatalog.Server.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDTO>> GetAllCategoriesAsync();
    Task<CategoryDTO?> GetCategoryByIdAsync(int id);
    Task<CategoryDTO> CreateCategoryAsync(CategoryDTO categoryDto);
    Task<CategoryDTO?> UpdateCategoryAsync(int id, CategoryDTO categoryDto);
    Task DeleteCategoryAsync(int id);
}
