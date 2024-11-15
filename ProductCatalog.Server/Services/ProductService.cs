using Microsoft.EntityFrameworkCore;
using ProductCatalog.Server.Data;
using ProductCatalog.Server.DTOs;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Models.Enums;
using ProductCatalog.Server.Services.Interfaces;

namespace ProductCatalog.Server.Services;

public class ProductService(ProductCatalogDbContext context, IUserContext userContext) : IProductService
{
    private readonly ProductCatalogDbContext _context = context;
    private readonly IUserContext _userContext = userContext;

    public async Task<List<ProductDTO>> GetAllProductsAsync()
    {
        try
        {
            var isUser = _userContext.IsInRole(UserRole.User);

            return await _context.Products
                .Select(product => new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Note = product.Note,
                    SpecialNote = isUser ? string.Empty : product.SpecialNote,
                    Category = new CategoryDTO
                    {
                        Id = product.Category.Id,
                        Name = product.Category.Name
                    }
                })
                .ToListAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while retrieving products. Please try again later.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("An unexpected error occurred. Please try again later.", ex);
        }
    }

    public async Task<ProductDTO?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;
        try
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Note = product.Note,
                SpecialNote = _userContext.IsInRole(UserRole.User) ? string.Empty : product.SpecialNote,
                Category = new CategoryDTO
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                }
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while retrieving products. Please try again later.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("An unexpected error occurred. Please try again later.", ex);
        }
    }

    public async Task<ProductDTO> CreateProductAsync(ProductDTO productDto)
    {
        try
        {
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description ?? string.Empty,
                Price = productDto.Price,
                Note = productDto.Note,
                SpecialNote = productDto.SpecialNote,
                CategoryId = productDto.Category.Id
            };

            await _context.Products.AddAsync(product);

            await _context.SaveChangesAsync();

            productDto.Id = product.Id;

            return productDto;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while retrieving products. Please try again later.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("An unexpected error occurred. Please try again later.", ex);
        }
    }

    public async Task<ProductDTO?> UpdateProductAsync(int id, ProductDTO productDto)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = productDto.Name;
            product.Description = productDto.Description ?? string.Empty;
            product.Price = productDto.Price;
            product.Note = productDto.Note;
            product.SpecialNote = _userContext.IsInRole(UserRole.User) ? product.SpecialNote :productDto.SpecialNote;
            product.CategoryId = _userContext.IsInRole(UserRole.User) ? product.CategoryId : productDto.Category.Id;

            await _context.SaveChangesAsync();

            return productDto;

        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while retrieving products. Please try again later.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("An unexpected error occurred. Please try again later.", ex);
        }
    }

    public async Task DeleteProductAsync(int id)
    {
        if (_userContext.IsInRole(UserRole.User))
        {
            throw new UnauthorizedAccessException($"User {_userContext.GetUserId} is unauthorized for operation.");
        }

        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while retrieving products. Please try again later.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("An unexpected error occurred. Please try again later.", ex);
        }
    }
}
