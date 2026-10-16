using System;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Data
{
    public class LifeOsDbContext : DbContext
    {
        public LifeOsDbContext(DbContextOptions<LifeOsDbContext> options) : base(options)
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; } = null!;
        public DbSet<UserSettings> UserSettings { get; set; } = null!;
        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<Card> Cards { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        public DbSet<Budget> Budgets { get; set; } = null!;
        public DbSet<SavingsGoal> SavingsGoals { get; set; } = null!;
        public DbSet<TaskItem> Tasks { get; set; } = null!;
        public DbSet<Habit> Habits { get; set; } = null!;
        public DbSet<Routine> Routines { get; set; } = null!;
        public DbSet<CalendarEvent> CalendarEvents { get; set; } = null!;
        public DbSet<LifeGoal> LifeGoals { get; set; } = null!;
        public DbSet<JournalEntry> JournalEntries { get; set; } = null!;
        public DbSet<ConveyanceTrip> ConveyanceTrips { get; set; } = null!;
        public DbSet<ConveyanceClaim> ConveyanceClaims { get; set; } = null!;
        public DbSet<AppNotification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for all currency/money columns
            modelBuilder.Entity<Account>().Property(a => a.Balance).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.MonthlyDeposit).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.MaturityAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.TotalLoanAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.RemainingPrincipal).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.MonthlyEmi).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Account>().Property(a => a.InterestRate).HasColumnType("decimal(5,2)");

            modelBuilder.Entity<Card>().Property(c => c.CreditLimit).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Card>().Property(c => c.CurrentBalance).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Budget>().Property(b => b.MonthlyLimit).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Budget>().Property(b => b.Spent).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SavingsGoal>().Property(s => s.TargetAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SavingsGoal>().Property(s => s.CurrentAmount).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<ConveyanceTrip>().Property(t => t.ActualCost).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConveyanceTrip>().Property(t => t.ClaimedCost).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<ConveyanceClaim>().Property(c => c.TotalActualCost).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConveyanceClaim>().Property(c => c.TotalClaimedCost).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConveyanceClaim>().Property(c => c.ApprovedDisbursedAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConveyanceClaim>().Property(c => c.CompanyDeduction).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConveyanceClaim>().Property(c => c.OutOfPocketLoss).HasColumnType("decimal(18,2)");

            // Soft-delete query filters
            modelBuilder.Entity<Account>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Card>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Transaction>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Budget>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<SavingsGoal>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<TaskItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Habit>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Routine>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CalendarEvent>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<LifeGoal>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<JournalEntry>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ConveyanceTrip>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ConveyanceClaim>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<AppNotification>().HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
