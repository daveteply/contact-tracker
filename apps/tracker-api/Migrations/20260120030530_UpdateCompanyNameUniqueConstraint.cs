using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tracker_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCompanyNameUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing case-sensitive unique index
            migrationBuilder.DropIndex(
                name: "IX_Companies_Name",
                table: "Companies");

            // Create a new case-insensitive unique index using lower() function
            migrationBuilder.Sql("CREATE UNIQUE INDEX \"IX_Companies_Name\" ON \"Companies\" (lower(\"Name\"))");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the case-insensitive index
            migrationBuilder.Sql("DROP INDEX \"IX_Companies_Name\"");

            // Recreate the original case-sensitive unique index
            migrationBuilder.CreateIndex(
                name: "IX_Companies_Name",
                table: "Companies",
                column: "Name",
                unique: true);
        }
    }
}
