using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for authentication operations (login.html)
    /// </summary>
    public class AuthController : Controller
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserService _userService;

        public AuthController(
            IAuthenticationService authenticationService,
            IUserService userService)
        {
            _authenticationService = authenticationService;
            _userService = userService;
        }

        /// <summary>
        /// Display login page
        /// </summary>
        /// <returns>Login view</returns>
        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        /// <summary>
        /// Process login request
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="password">Password</param>
        /// <param name="rememberMe">Remember me flag</param>
        /// <param name="returnUrl">Return URL after login</param>
        /// <returns>Redirect to dashboard or return to login</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string username, string password, bool rememberMe = false, string returnUrl = null)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                TempData["Error"] = "Username and password are required";
                return View();
            }

            var user = await _authenticationService.AuthenticateAsync(username, password);
            
            if (user == null)
            {
                TempData["Error"] = "Invalid username or password";
                return View();
            }

            if (user.IsLockedOut)
            {
                TempData["Error"] = $"Account is locked. Please try again after {user.LockoutEnd?.ToString("HH:mm:ss")}";
                return View();
            }

            // Store user session (you can implement proper authentication with cookies/JWT here)
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            HttpContext.Session.SetString("Username", user.Username);
            HttpContext.Session.SetString("UserRole", user.Role);
            HttpContext.Session.SetString("FullName", user.FullName ?? user.Username);

            // Update last login
            await _userService.UpdateLastLoginAsync(user.Id);

            TempData["Success"] = $"Welcome back, {user.FullName ?? user.Username}!";

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index", "Dashboard");
        }

        /// <summary>
        /// Logout user
        /// </summary>
        /// <returns>Redirect to login page</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            TempData["Success"] = "You have been logged out successfully";
            return RedirectToAction("Login");
        }

        /// <summary>
        /// Display registration page
        /// </summary>
        /// <returns>Register view</returns>
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        /// <summary>
        /// Process registration request
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="email">Email</param>
        /// <param name="password">Password</param>
        /// <param name="confirmPassword">Confirm password</param>
        /// <param name="fullName">Full name</param>
        /// <returns>Redirect to login or return to register</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(string username, string email, string password, string confirmPassword, string fullName)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                TempData["Error"] = "All fields are required";
                return View();
            }

            if (password != confirmPassword)
            {
                TempData["Error"] = "Passwords do not match";
                return View();
            }

            try
            {
                var user = await _authenticationService.RegisterAsync(username, email, password, fullName, "Cashier");
                TempData["Success"] = "Registration successful! Please login.";
                return RedirectToAction("Login");
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
                return View();
            }
        }

        /// <summary>
        /// Display forgot password page
        /// </summary>
        /// <returns>Forgot password view</returns>
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        /// <summary>
        /// Process forgot password request
        /// </summary>
        /// <param name="email">Email address</param>
        /// <returns>Confirmation view</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                TempData["Error"] = "Email is required";
                return View();
            }

            var user = await _userService.GetUserByEmailAsync(email);
            if (user != null)
            {
                var token = await _authenticationService.GeneratePasswordResetTokenAsync(user.Id);
                // TODO: Send email with reset link
                // For now, just show the token (remove this in production)
                TempData["Info"] = $"Password reset token: {token}";
            }

            TempData["Success"] = "If the email exists, a password reset link has been sent.";
            return View("ForgotPasswordConfirmation");
        }

        /// <summary>
        /// Display reset password page
        /// </summary>
        /// <param name="token">Reset token</param>
        /// <returns>Reset password view</returns>
        [HttpGet]
        public IActionResult ResetPassword(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return RedirectToAction("Login");
            }

            ViewData["Token"] = token;
            return View();
        }

        /// <summary>
        /// Process reset password request
        /// </summary>
        /// <param name="token">Reset token</param>
        /// <param name="email">Email address</param>
        /// <param name="newPassword">New password</param>
        /// <param name="confirmPassword">Confirm password</param>
        /// <returns>Redirect to login or return to reset</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(string token, string email, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(newPassword))
            {
                TempData["Error"] = "All fields are required";
                ViewData["Token"] = token;
                return View();
            }

            if (newPassword != confirmPassword)
            {
                TempData["Error"] = "Passwords do not match";
                ViewData["Token"] = token;
                return View();
            }

            try
            {
                var success = await _authenticationService.ResetPasswordAsync(email, token, newPassword);
                if (success)
                {
                    TempData["Success"] = "Password reset successful! Please login with your new password.";
                    return RedirectToAction("Login");
                }
                else
                {
                    TempData["Error"] = "Invalid or expired reset token";
                    ViewData["Token"] = token;
                    return View();
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
                ViewData["Token"] = token;
                return View();
            }
        }

        /// <summary>
        /// Access denied page
        /// </summary>
        /// <returns>Access denied view</returns>
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
