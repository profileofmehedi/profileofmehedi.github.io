using System;

namespace LifeOS.Web.Models.Entities
{
    public class UserProfile : BaseEntity
    {
        public string Name { get; set; } = "মেহেদী হাসান";
        public string Email { get; set; } = "demo@lifeos.app";
        public string Role { get; set; } = "সিনিয়র সফটওয়্যার আর্কিটেক্ট";
        public string? Avatar { get; set; } = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
        public string? Location { get; set; } = "ঢাকা, বাংলাদেশ";
        public string? Timezone { get; set; } = "Asia/Dhaka";
        public DateTime? JoinedDate { get; set; } = new DateTime(2025, 1, 1);
        public string? Bio { get; set; } = "স্কেলেবল সিস্টেম, সচেতন জীবনযাপন ও আর্থিক স্বাধীনতা অর্জনে নিবেদিত।";
    }

    public class UserSettings : BaseEntity
    {
        public string Currency { get; set; } = "BDT";
        public string CurrencySymbol { get; set; } = "৳";
        public string Theme { get; set; } = "light";
        public string DateFormat { get; set; } = "DD MMM YYYY";
        public string FirstDayOfWeek { get; set; } = "Sunday";
        public bool PrivacyMode { get; set; } = false;
        public string DefaultPage { get; set; } = "dashboard";
        public bool NotificationSound { get; set; } = true;
        public int BudgetAlertThreshold { get; set; } = 85;
    }
}
