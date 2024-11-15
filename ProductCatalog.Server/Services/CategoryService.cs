using Microsoft.EntityFrameworkCore;
using ProductCatalog.Server.Data;
using ProductCatalog.Server.DTOs;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Services.Interfaces;

namespace ProductCatalog.Server.Services;

public class CategoryService(ProductCatalogDbContext context) : ICategoryService
{

    private readonly ProductCatalogDbContext _context = context;

    public async Task<List<CategoryDTO>> GetAllCategoriesAsync()
    {
        return await _context.Categories
            .Select(c => new CategoryDTO { Id = c.Id, Name = c.Name })
            .ToListAsync();
    }

    public async Task<CategoryDTO?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return null;

        return new CategoryDTO { Id = category.Id, Name = category.Name };
    }

    public async Task<CategoryDTO> CreateCategoryAsync(CategoryDTO categoryDto)
    {
        var category = new Category { Name = categoryDto.Name };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        categoryDto.Id = category.Id;
        return categoryDto;
    }

    public async Task<CategoryDTO?> UpdateCategoryAsync(int id, CategoryDTO categoryDto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return null;

        category.Name = categoryDto.Name;

        await _context.SaveChangesAsync();

        return categoryDto;
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category != null)
        {
            _context.Products.RemoveRange(category.Products); // Удаляем все продукты категории
            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();
        }
    }
}
