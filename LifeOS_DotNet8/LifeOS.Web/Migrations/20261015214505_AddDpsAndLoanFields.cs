using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOS.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddDpsAndLoanFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmiDueDay",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstallmentDay",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InterestRate",
                table: "Accounts",
                type: "decimal(5,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoanTenureMonths",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoanType",
                table: "Accounts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaturityAmount",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MaturityDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MonthlyDeposit",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MonthlyEmi",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaidEmis",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaidInstallments",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RemainingPrincipal",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenureMonths",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalLoanAmount",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmiDueDay",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "InstallmentDay",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "InterestRate",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "LoanTenureMonths",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "LoanType",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MaturityAmount",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MaturityDate",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MonthlyDeposit",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MonthlyEmi",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PaidEmis",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PaidInstallments",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "RemainingPrincipal",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "TenureMonths",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "TotalLoanAmount",
                table: "Accounts");
        }
    }
}
