using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Authentication operations
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher<User> _passwordHasher;
        private const int MaxFailedAttempts = 5;
        private const int LockoutMinutes = 30;

        public AuthenticationService(IUnitOfWork unitOfWork, IPasswordHasher<User> passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Username == username || u.Email == username);
            
            if (user == null) return null;

            // Check if account is locked
            if (user.IsLockedOut)
            {
                return null;
            }

            // Verify password
            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                await IncrementFailedLoginAttemptAsync(user.Id);
                return null;
            }

            // Reset failed login attempts on successful login
            await ResetFailedLoginAttemptsAsync(user.Id);
            
            // Update last login
            user.LastLogin = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return user;
        }

        public async Task<User?> RegisterAsync(User user, string password)
        {
            // Check if username or email already exists
            var existingUser = await _unitOfWork.Users.FirstOrDefaultAsync(
                u => u.Username == user.Username || u.Email == user.Email);
            
            if (existingUser != null) return null;

            user.PasswordHash = _passwordHasher.HashPassword(user, password);
            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return user;
        }

        public async Task<string> HashPasswordAsync(string password)
        {
            var user = new User(); // Temporary user for hashing
            return await Task.FromResult(_passwordHasher.HashPassword(user, password));
        }

        public async Task<bool> VerifyPasswordAsync(string password, string passwordHash)
        {
            var user = new User { PasswordHash = passwordHash };
            var result = _passwordHasher.VerifyHashedPassword(user, passwordHash, password);
            return await Task.FromResult(result == PasswordVerificationResult.Success);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return false;

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, currentPassword);
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return false;
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<string> GeneratePasswordResetTokenAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Generate a secure random token
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(24);
            
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return token;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
            
            if (user == null) return false;
            
            if (!user.PasswordResetTokenExpiry.HasValue || user.PasswordResetTokenExpiry.Value < DateTime.UtcNow)
            {
                return false;
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ValidatePasswordResetTokenAsync(string token)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
            
            if (user == null) return false;
            
            if (!user.PasswordResetTokenExpiry.HasValue || user.PasswordResetTokenExpiry.Value < DateTime.UtcNow)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> IncrementFailedLoginAttemptAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return false;

            user.FailedLoginAttempts++;

            if (user.FailedLoginAttempts >= MaxFailedAttempts)
            {
                await LockAccountAsync(userId, LockoutMinutes);
            }
            else
            {
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync();
            }

            return true;
        }

        public async Task ResetFailedLoginAttemptsAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null)
            {
                user.FailedLoginAttempts = 0;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<bool> IsAccountLockedOutAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return false;

            return user.IsLockedOut;
        }

        public async Task LockAccountAsync(int userId, int lockoutMinutes)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(lockoutMinutes);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task UnlockAccountAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null)
            {
                user.LockoutEnd = null;
                user.FailedLoginAttempts = 0;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}
