using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Authentication operations
    /// </summary>
    public interface IAuthenticationService
    {
        Task<User?> AuthenticateAsync(string username, string password);
        Task<User?> RegisterAsync(User user, string password);
        Task<string> HashPasswordAsync(string password);
        Task<bool> VerifyPasswordAsync(string password, string passwordHash);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<string> GeneratePasswordResetTokenAsync(int userId);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> ValidatePasswordResetTokenAsync(string token);
        
        // Account lockout
        Task<bool> IncrementFailedLoginAttemptAsync(int userId);
        Task ResetFailedLoginAttemptsAsync(int userId);
        Task<bool> IsAccountLockedOutAsync(int userId);
        Task LockAccountAsync(int userId, int lockoutMinutes);
        Task UnlockAccountAsync(int userId);
    }
}
