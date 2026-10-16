using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(LifeOsDbContext context)
        {
            // 1. Apply any pending EF Core migrations automatically
            await context.Database.MigrateAsync();

            // 2. Ensure basic UserSettings exists if missing (without any mock/demo data)
            if (!await context.UserSettings.AnyAsync())
            {
                context.UserSettings.Add(new UserSettings
                {
                    Currency = "BDT",
                    CurrencySymbol = "৳",
                    Theme = "light",
                    DateFormat = "DD MMM YYYY",
                    FirstDayOfWeek = "Sunday",
                    PrivacyMode = false,
                    DefaultPage = "dashboard",
                    NotificationSound = true,
                    BudgetAlertThreshold = 85
                });
                await context.SaveChangesAsync();
            }

            // 3. Ensure basic UserProfile exists if missing (without mock data)
            if (!await context.UserProfiles.AnyAsync())
            {
                context.UserProfiles.Add(new UserProfile
                {
                    Name = "মেহেদী হাসান",
                    Email = "",
                    Role = "ইউজার",
                    Avatar = "",
                    Location = "ঢাকা, বাংলাদেশ",
                    Timezone = "Asia/Dhaka",
                    JoinedDate = DateTime.UtcNow,
                    Bio = ""
                });
                await context.SaveChangesAsync();
            }

            // NOTE: Absolutely NO demo data seeding for:
            // Accounts, Cards, Transactions, Budgets, SavingsGoals, Tasks, Habits,
            // Routines, CalendarEvents, ConveyanceTrips, ConveyanceClaims, LifeGoals,
            // JournalEntries, Notifications.
            // The user will enter and manage their own real data manually.
        }
    }
}
