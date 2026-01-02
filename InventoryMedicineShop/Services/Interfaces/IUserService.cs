using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for User operations
    /// </summary>
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
        Task<User> CreateUserAsync(User user, string password);
        Task<User> UpdateUserAsync(User user);
        Task<bool> UpdatePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UserExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);
        
        // Account management
        Task<bool> DeactivateUserAsync(int userId);
        Task<bool> ActivateUserAsync(int userId);
        Task UpdateLastLoginAsync(int userId);
        Task<int> GetUserSalesCountAsync(int userId);
    }
}
