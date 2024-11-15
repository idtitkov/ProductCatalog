using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Server.Models;
using ProductCatalog.Server.Models.Enums;

namespace ProductCatalog.Server.Data;

public static class SeedData
{
    public static async Task Initialize(ProductCatalogDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync(UserRole.Admin.ToString()))
        {
            await roleManager.CreateAsync(new IdentityRole { Name = UserRole.Admin.ToString() });
        }

        if (!await roleManager.RoleExistsAsync(UserRole.User.ToString()))
        {
            await roleManager.CreateAsync(new IdentityRole { Name = UserRole.User.ToString() });
        }

        if (!await roleManager.RoleExistsAsync(UserRole.SuperUser.ToString()))
        {
            await roleManager.CreateAsync(new IdentityRole { Name = UserRole.SuperUser.ToString() });
        }

        if (!await context.Users.AnyAsync())
        {
            var admin = new IdentityUser
            {
                UserName = "admin",
            };

            var user = new IdentityUser
            {
                UserName = "user",
            };

            var superuser = new IdentityUser
            {
                UserName = "superuser",
            };

            await userManager.CreateAsync(admin, "admin");
            await userManager.CreateAsync(user, "user");
            await userManager.CreateAsync(superuser, "superuser");

            
            await userManager.AddToRoleAsync(user, UserRole.User.ToString());
            await userManager.AddToRoleAsync(superuser, UserRole.SuperUser.ToString());

        }

        // Seed categories
        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category { Name = "Еда" },
                new Category { Name = "Вкусности" },
                new Category { Name = "Вода" }
            );

            await context.SaveChangesAsync();
        }

        // Seed products
        if (!await context.Products.AnyAsync())
        {
            var categories = await context.Categories.ToListAsync();

            context.Products.AddRange(
                new Product
                {
                    Name = "Селедка",
                    Description = "Селедка соленая",
                    Price = 10000,
                    Note = "Акция",
                    SpecialNote = "Пересоленая",
                    CategoryId = categories.Where(c => c.Name == "Еда").Select(c => c.Id).First()
                },
                 new Product
                 {
                     Name = "Тушенка",
                     Description = "Тушенка говяжья",
                     Price = 20000,
                     Note = "Вкусная",
                     SpecialNote = "Жилы",
                     CategoryId = categories.Where(c => c.Name == "Еда").Select(c => c.Id).First()
                 },
                  new Product
                  {
                      Name = "Сгущенка",
                      Description = "В банках",
                      Price = 30000,
                      Note = "С ключом",
                      SpecialNote = "Вкусная",
                      CategoryId = categories.Where(c => c.Name == "Вкусности").Select(c => c.Id).First()
                  },
                   new Product
                   {
                       Name = "Квас",
                       Description = "В бутылках",
                       Price = 15000,
                       Note = "Вятский",
                       SpecialNote = "Теплый",
                       CategoryId = categories.Where(c => c.Name == "Вода").Select(c => c.Id).First()
                   }
            );

            await context.SaveChangesAsync();
        }
    }
}
