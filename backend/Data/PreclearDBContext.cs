using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PreClear.Api.Models;
using PreClear.Api.Utils;

namespace PreClear.Api.Data
{
    public class PreclearDbContext : DbContext
    {
        public PreclearDbContext(DbContextOptions<PreclearDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<ShipmentParty> ShipmentParties { get; set; }
        public DbSet<ShipmentPackage> ShipmentPackages { get; set; }
        public DbSet<ShipmentItem> ShipmentItems { get; set; }
        public DbSet<ShipmentService> ShipmentServices { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ShipmentCompliance> ShipmentCompliance { get; set; }
        public DbSet<AiFinding> AiFindings { get; set; }
        public DbSet<ShipmentDocument> ShipmentDocuments { get; set; }
        public DbSet<BrokerReview> BrokerReviews { get; set; }
        public DbSet<BrokerRequest> BrokerRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ShipmentMessage> ShipmentMessages { get; set; }
        public DbSet<ShipmentTracking> ShipmentTracking { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ImportExportRule> ImportExportRules { get; set; }
        public DbSet<ApprovalLog> ApprovalLogs { get; set; }
        public DbSet<RuleChangeRequest> RuleChangeRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------- users
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.FirstName).HasColumnName("first_name").HasMaxLength(150).IsRequired();
                entity.Property(u => u.LastName).HasColumnName("last_name").HasMaxLength(150);
                entity.Property(u => u.Name).HasColumnName("name")
                      .HasComputedColumnSql("CONCAT(COALESCE(first_name,''),' ',COALESCE(last_name,''))", false);

                entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
                entity.Property(u => u.Role).HasColumnName("role").HasMaxLength(50).IsRequired();
                entity.Property(u => u.Phone).HasColumnName("phone").HasMaxLength(50).IsRequired();
                entity.Property(u => u.Company).HasColumnName("company").HasMaxLength(255).IsRequired();

                entity.Property(u => u.TosAccepted).HasColumnName("tos_accepted").HasDefaultValue(false);
                entity.Property(u => u.TosAcceptedAt).HasColumnName("tos_accepted_at").HasColumnType("datetime(3)");
                entity.Property(u => u.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
                entity.Property(u => u.VerificationToken).HasColumnName("verification_token").HasMaxLength(200);

                entity.Property(u => u.InviteCode).HasColumnName("invite_code").HasMaxLength(100);
                entity.Property(u => u.InviteExpiresAt).HasColumnName("invite_expires_at").HasColumnType("datetime(3)");

                entity.Property(u => u.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(u => u.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(u => u.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime(3)").ValueGeneratedOnAddOrUpdate();

                entity.Property(u => u.Metadata)
                      .HasColumnName("metadata")
                      .HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));

                entity.HasIndex(u => u.Role).HasDatabaseName("idx_users_role");
                entity.HasIndex(u => u.IsActive).HasDatabaseName("idx_users_active");
            });

            // -------- shipments
            modelBuilder.Entity<Shipment>(entity =>
            {
                entity.ToTable("shipments");
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id).HasColumnName("id");
                entity.Property(s => s.ReferenceId).HasColumnName("reference_id").HasMaxLength(120).IsRequired();
                entity.HasIndex(s => s.ReferenceId).HasDatabaseName("idx_shipments_reference");
                entity.Property(s => s.ShipmentName).HasColumnName("shipment_name").HasMaxLength(255);
                entity.Property(s => s.Mode).HasColumnName("mode").HasConversion<string>().HasMaxLength(10).HasDefaultValue(ShipmentMode.Ground);
                entity.Property(s => s.ShipmentType).HasColumnName("shipment_type").HasConversion<string>().HasMaxLength(20).HasDefaultValue(ShipmentType.International);
                entity.Property(s => s.Carrier).HasColumnName("carrier").HasMaxLength(100).HasDefaultValue("UPS");
                entity.Property(s => s.Status).HasColumnName("status").HasMaxLength(50).HasDefaultValue(ShipmentStatus.draft.ToString());
                entity.Property(s => s.PreclearToken).HasColumnName("preclear_token").HasMaxLength(150);
                entity.Property(s => s.CreatedBy).HasColumnName("created_by");
                entity.HasOne<User>().WithMany().HasForeignKey(s => s.CreatedBy).HasConstraintName("fk_shipments_createdby").OnDelete(DeleteBehavior.SetNull);
                entity.Property(s => s.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(s => s.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime(3)").ValueGeneratedOnAddOrUpdate();

                entity.HasIndex(s => s.Mode).HasDatabaseName("idx_shipments_mode");
                entity.HasIndex(s => s.Status).HasDatabaseName("idx_shipments_status");
            });

            // -------- shipment_parties
            modelBuilder.Entity<ShipmentParty>(entity =>
            {
                entity.ToTable("shipment_parties");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.ShipmentId).HasColumnName("shipment_id");
                entity.Property(p => p.PartyType).HasColumnName("party_type").HasConversion<string>().HasMaxLength(20);
                entity.Property(p => p.CompanyName).HasColumnName("company_name").HasMaxLength(255).IsRequired();
                entity.Property(p => p.ContactName).HasColumnName("contact_name").HasMaxLength(200);
                entity.Property(p => p.Phone).HasColumnName("phone").HasMaxLength(50);
                entity.Property(p => p.Email).HasColumnName("email").HasMaxLength(255);
                entity.Property(p => p.Address1).HasColumnName("address1").HasMaxLength(500);
                entity.Property(p => p.Address2).HasColumnName("address2").HasMaxLength(500);
                entity.Property(p => p.City).HasColumnName("city").HasMaxLength(150);
                entity.Property(p => p.State).HasColumnName("state").HasMaxLength(150);
                entity.Property(p => p.PostalCode).HasColumnName("postal_code").HasMaxLength(50);
                entity.Property(p => p.Country).HasColumnName("country").HasMaxLength(100);
                entity.Property(p => p.TaxId).HasColumnName("tax_id").HasMaxLength(100);

                entity.HasOne<Shipment>().WithMany().HasForeignKey(p => p.ShipmentId).HasConstraintName("fk_parties_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(p => p.ShipmentId).HasDatabaseName("idx_parties_shipment");
            });

            // -------- shipment_packages
            modelBuilder.Entity<ShipmentPackage>(entity =>
            {
                entity.ToTable("shipment_packages");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.ShipmentId).HasColumnName("shipment_id");
                entity.Property(p => p.PackageType).HasColumnName("package_type").HasConversion<string>().HasMaxLength(20).HasDefaultValue(PackageType.Box);
                entity.Property(p => p.Length).HasColumnName("length").HasColumnType("decimal(10,3)");
                entity.Property(p => p.Width).HasColumnName("width").HasColumnType("decimal(10,3)");
                entity.Property(p => p.Height).HasColumnName("height").HasColumnType("decimal(10,3)");
                entity.Property(p => p.DimensionUnit).HasColumnName("dimension_unit").HasConversion<string>().HasMaxLength(10).HasDefaultValue(DimensionUnit.cm);
                entity.Property(p => p.Weight).HasColumnName("weight").HasColumnType("decimal(12,3)");
                entity.Property(p => p.WeightUnit).HasColumnName("weight_unit").HasConversion<string>().HasMaxLength(10).HasDefaultValue(WeightUnit.kg);
                entity.Property(p => p.Stackable).HasColumnName("stackable").HasDefaultValue(false);

                entity.HasOne<Shipment>().WithMany().HasForeignKey(p => p.ShipmentId).HasConstraintName("fk_packages_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(p => p.ShipmentId).HasDatabaseName("idx_packages_shipment");
            });

            // -------- shipment_items
            modelBuilder.Entity<ShipmentItem>(entity =>
            {
                entity.ToTable("shipment_items");
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Id).HasColumnName("id");
                entity.Property(i => i.ShipmentId).HasColumnName("shipment_id");
                entity.Property(i => i.ProductName).HasColumnName("product_name").HasMaxLength(500);
                entity.Property(i => i.Description).HasColumnName("description").HasColumnType("text");
                entity.Property(i => i.HsCode).HasColumnName("hs_code").HasMaxLength(50);
                entity.Property(i => i.Quantity).HasColumnName("quantity").HasColumnType("decimal(18,3)").HasDefaultValue(1);
                entity.Property(i => i.Unit).HasColumnName("unit").HasMaxLength(50).HasDefaultValue("pcs");
                entity.Property(i => i.UnitPrice).HasColumnName("unit_price").HasColumnType("decimal(18,4)");
                entity.Property(i => i.TotalValue).HasColumnName("total_value").HasColumnType("decimal(18,4)");
                entity.Property(i => i.CountryOfOrigin).HasColumnName("country_of_origin").HasMaxLength(100);
                entity.Property(i => i.ExportReason).HasColumnName("export_reason").HasConversion<string>().HasMaxLength(50).HasDefaultValue(ExportReason.Sale);

                entity.HasOne<Shipment>().WithMany().HasForeignKey(i => i.ShipmentId).HasConstraintName("fk_items_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(i => i.ShipmentId).HasDatabaseName("idx_items_shipment");
                entity.HasIndex(i => i.HsCode).HasDatabaseName("idx_items_hscode");
            });

            // -------- shipment_services
            modelBuilder.Entity<ShipmentService>(entity =>
            {
                entity.ToTable("shipment_services");
                entity.HasKey(s => s.ShipmentId);
                entity.Property(s => s.ShipmentId).HasColumnName("shipment_id");
                entity.Property(s => s.ServiceLevel).HasColumnName("service_level").HasConversion<string>().HasMaxLength(20).HasDefaultValue(ServiceLevel.Standard);
                entity.Property(s => s.Incoterm).HasColumnName("incoterm").HasMaxLength(20);
                entity.Property(s => s.BillTo).HasColumnName("bill_to").HasConversion<string>().HasMaxLength(20).HasDefaultValue(BillTo.Shipper);
                entity.Property(s => s.Currency).HasColumnName("currency").HasMaxLength(3).HasDefaultValue("USD");
                entity.Property(s => s.DeclaredValue).HasColumnName("declared_value").HasColumnType("decimal(18,2)");
                entity.Property(s => s.InsuranceRequired).HasColumnName("insurance_required").HasDefaultValue(false);

                entity.HasOne<Shipment>().WithOne().HasForeignKey<ShipmentService>(s => s.ShipmentId).HasConstraintName("fk_services_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(s => s.ShipmentId).HasDatabaseName("idx_services_shipment");
            });

            // -------- payments
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payments");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.ShipmentId).HasColumnName("shipment_id");
                entity.Property(p => p.Payer).HasColumnName("payer").HasConversion<string>().HasMaxLength(20).HasDefaultValue(Payer.Shipper);
                entity.Property(p => p.Amount).HasColumnName("amount").HasColumnType("decimal(18,2)");
                entity.Property(p => p.Currency).HasColumnName("currency").HasMaxLength(3).HasDefaultValue("USD");
                entity.Property(p => p.PaymentStatus).HasColumnName("payment_status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(PaymentStatus.pending);
                entity.Property(p => p.PaymentMethod).HasColumnName("payment_method").HasMaxLength(100);
                entity.Property(p => p.PaidAt).HasColumnName("paid_at").HasColumnType("datetime(3)");
                entity.Property(p => p.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(p => p.ShipmentId).HasConstraintName("fk_payments_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(p => p.ShipmentId).HasDatabaseName("idx_payments_shipment");
                entity.HasIndex(p => p.PaymentStatus).HasDatabaseName("idx_payments_status");
            });

            // -------- shipment_compliance
            modelBuilder.Entity<ShipmentCompliance>(entity =>
            {
                entity.ToTable("shipment_compliance");
                entity.HasKey(c => c.ShipmentId);
                entity.Property(c => c.ShipmentId).HasColumnName("shipment_id");
                entity.Property(c => c.DangerousGoods).HasColumnName("dangerous_goods").HasDefaultValue(false);
                entity.Property(c => c.LithiumBattery).HasColumnName("lithium_battery").HasDefaultValue(false);
                entity.Property(c => c.FoodPharmaFlag).HasColumnName("food_pharma_flag").HasDefaultValue(false);
                entity.Property(c => c.Eccn).HasColumnName("eccn").HasMaxLength(50);
                entity.Property(c => c.ExportLicenseRequired).HasColumnName("export_license_required").HasDefaultValue(false);
                entity.Property(c => c.RestrictedFlag).HasColumnName("restricted_flag").HasDefaultValue(false);
                entity.Property(c => c.SanctionedCountryFlag).HasColumnName("sanctioned_country_flag").HasDefaultValue(false);
                entity.Property(c => c.RiskLevel).HasColumnName("risk_level").HasConversion<string>().HasMaxLength(10).HasDefaultValue(RiskLevel.Low);
                entity.Property(c => c.AiScore).HasColumnName("ai_score");
                entity.Property(c => c.AiStatus).HasColumnName("ai_status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(AiStatus.NeedsDocuments);
                entity.Property(c => c.AiNotes).HasColumnName("ai_notes").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));

                entity.HasOne<Shipment>().WithOne().HasForeignKey<ShipmentCompliance>(c => c.ShipmentId).HasConstraintName("fk_compliance_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(c => c.AiStatus).HasDatabaseName("idx_compliance_ai_status");
            });

            // -------- ai_findings
            modelBuilder.Entity<AiFinding>(entity =>
            {
                entity.ToTable("ai_findings");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.ShipmentId).HasColumnName("shipment_id");
                entity.Property(a => a.RuleCode).HasColumnName("rule_code").HasMaxLength(100);
                entity.Property(a => a.Severity).HasColumnName("severity").HasConversion<string>().HasMaxLength(20).HasDefaultValue(Severity.warning);
                entity.Property(a => a.Message).HasColumnName("message").HasColumnType("text").IsRequired();
                entity.Property(a => a.SuggestedAction).HasColumnName("suggested_action").HasMaxLength(255);
                entity.Property(a => a.Details).HasColumnName("details").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(a => a.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(a => a.ShipmentId).HasConstraintName("fk_aifindings_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(a => a.ShipmentId).HasDatabaseName("idx_aifindings_shipment");
            });

            // -------- shipment_documents
            modelBuilder.Entity<ShipmentDocument>(entity =>
            {
                entity.ToTable("shipment_documents");
                entity.HasKey(d => d.Id);
                entity.Property(d => d.Id).HasColumnName("id");
                entity.Property(d => d.ShipmentId).HasColumnName("shipment_id");
                entity.Property(d => d.DocumentType).HasColumnName("document_type").HasConversion<string>().HasMaxLength(50).HasDefaultValue(DocumentType.Other);
                entity.Property(d => d.FileUrl).HasColumnName("file_url").HasMaxLength(2000);
                entity.Property(d => d.UploadedBy).HasColumnName("uploaded_by");
                entity.Property(d => d.VerifiedByBroker).HasColumnName("verified_by_broker").HasDefaultValue(false);
                entity.Property(d => d.UploadedAt).HasColumnName("uploaded_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(d => d.Version).HasColumnName("version").HasDefaultValue(1);

                entity.HasOne<Shipment>().WithMany().HasForeignKey(d => d.ShipmentId).HasConstraintName("fk_docs_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(d => d.ShipmentId).HasDatabaseName("idx_documents_shipment");
            });

            // -------- broker_reviews
            modelBuilder.Entity<BrokerReview>(entity =>
            {
                entity.ToTable("broker_reviews");
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Id).HasColumnName("id");
                entity.Property(b => b.ShipmentId).HasColumnName("shipment_id");
                entity.Property(b => b.BrokerId).HasColumnName("broker_id");
                entity.Property(b => b.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(ReviewStatus.Pending);
                entity.Property(b => b.Comments).HasColumnName("comments").HasColumnType("text");
                entity.Property(b => b.ReviewedAt).HasColumnName("reviewed_at").HasColumnType("datetime(3)");
                entity.Property(b => b.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(b => b.ShipmentId).HasConstraintName("fk_brokerreviews_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<User>().WithMany().HasForeignKey(b => b.BrokerId).HasConstraintName("fk_brokerreviews_broker").OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(b => b.ShipmentId).HasDatabaseName("idx_brokerreviews_shipment");
            });

            // -------- broker_requests
            modelBuilder.Entity<BrokerRequest>(entity =>
            {
                entity.ToTable("broker_requests");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.ShipmentId).HasColumnName("shipment_id");
                entity.Property(r => r.RequestedDocument).HasColumnName("requested_document").HasMaxLength(255).IsRequired();
                entity.Property(r => r.Message).HasColumnName("message").HasColumnType("text");
                entity.Property(r => r.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(RequestStatus.Open);
                entity.Property(r => r.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(r => r.FulfilledAt).HasColumnName("fulfilled_at").HasColumnType("datetime(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(r => r.ShipmentId).HasConstraintName("fk_brokerrequests_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(r => r.ShipmentId).HasDatabaseName("idx_brokerrequests_shipment");
            });

            // -------- notifications
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notifications");
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Id).HasColumnName("id");
                entity.Property(n => n.UserId).HasColumnName("user_id");
                entity.Property(n => n.Type).HasColumnName("type").HasMaxLength(100);
                entity.Property(n => n.Message).HasColumnName("message").HasColumnType("text");
                entity.Property(n => n.IsRead).HasColumnName("is_read").HasDefaultValue(false);
                entity.Property(n => n.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<User>().WithMany().HasForeignKey(n => n.UserId).HasConstraintName("fk_notifications_user").OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(n => n.UserId).HasDatabaseName("idx_notifications_user");
            });

            // -------- shipment_messages
            modelBuilder.Entity<ShipmentMessage>(entity =>
            {
                entity.ToTable("shipment_messages");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).HasColumnName("id");
                entity.Property(m => m.ShipmentId).HasColumnName("shipment_id");
                entity.Property(m => m.SenderId).HasColumnName("sender_id");
                entity.Property(m => m.Message).HasColumnName("message").HasColumnType("text").IsRequired();
                entity.Property(m => m.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(m => m.ShipmentId).HasConstraintName("fk_msgs_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<User>().WithMany().HasForeignKey(m => m.SenderId).HasConstraintName("fk_msgs_sender").OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(m => m.ShipmentId).HasDatabaseName("idx_msgs_shipment");
            });

            // -------- shipment_tracking
            modelBuilder.Entity<ShipmentTracking>(entity =>
            {
                entity.ToTable("shipment_tracking");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id).HasColumnName("id");
                entity.Property(t => t.ShipmentId).HasColumnName("shipment_id");
                entity.Property(t => t.Status).HasColumnName("status").HasMaxLength(200);
                entity.Property(t => t.Location).HasColumnName("location").HasMaxLength(255);
                entity.Property(t => t.EventTime).HasColumnName("event_time").HasColumnType("datetime(3)");
                entity.Property(t => t.Details).HasColumnName("details").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(t => t.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<Shipment>().WithMany().HasForeignKey(t => t.ShipmentId).HasConstraintName("fk_tracking_shipment").OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(t => t.ShipmentId).HasDatabaseName("idx_tracking_shipment");
            });

            // -------- audit_logs
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("audit_logs");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.UserId).HasColumnName("user_id");
                entity.Property(a => a.Entity).HasColumnName("entity").HasMaxLength(100).IsRequired();
                entity.Property(a => a.EntityId).HasColumnName("entity_id");
                entity.Property(a => a.Action).HasColumnName("action").HasMaxLength(100).IsRequired();
                entity.Property(a => a.Details).HasColumnName("details").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(a => a.PerformedAt).HasColumnName("performed_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<User>().WithMany().HasForeignKey(a => a.UserId).HasConstraintName("fk_audit_user").OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(a => new { a.Entity, a.EntityId }).HasDatabaseName("idx_audit_entity");
            });

            // -------- import_export_rules
            modelBuilder.Entity<ImportExportRule>(entity =>
            {
                entity.ToTable("import_export_rules");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.CountryCode).HasColumnName("country_code").HasMaxLength(2);
                entity.Property(r => r.HsCode).HasColumnName("hs_code").HasMaxLength(50);
                entity.Property(r => r.RuleKey).HasColumnName("rule_key").HasMaxLength(200).IsRequired();
                entity.Property(r => r.Title).HasColumnName("title").HasMaxLength(255);
                entity.Property(r => r.Description).HasColumnName("description").HasColumnType("text");
                entity.Property(r => r.RuleJson).HasColumnName("rule_json").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(r => r.Source).HasColumnName("source").HasMaxLength(255);
                entity.Property(r => r.Version).HasColumnName("version").HasDefaultValue(1);
                entity.Property(r => r.Active).HasColumnName("active").HasDefaultValue(true);
                entity.Property(r => r.EffectiveFrom).HasColumnName("effective_from").HasColumnType("datetime(3)");
                entity.Property(r => r.EffectiveTo).HasColumnName("effective_to").HasColumnType("datetime(3)");
                entity.Property(r => r.CreatedBy).HasColumnName("created_by");
                entity.Property(r => r.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(r => r.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime(3)").ValueGeneratedOnAddOrUpdate();

                entity.HasOne<User>().WithMany().HasForeignKey(r => r.CreatedBy).OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(r => r.CountryCode).HasDatabaseName("idx_rules_country");
                entity.HasIndex(r => r.HsCode).HasDatabaseName("idx_rules_hs");
                entity.HasIndex(r => r.RuleKey).HasDatabaseName("idx_rules_key");
                entity.HasIndex(r => r.Active).HasDatabaseName("idx_rules_active");
            });

            // -------- approval_logs
            modelBuilder.Entity<ApprovalLog>(entity =>
            {
                entity.ToTable("approval_logs");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.Entity).HasColumnName("entity").HasMaxLength(100).IsRequired();
                entity.Property(a => a.EntityId).HasColumnName("entity_id");
                entity.Property(a => a.ApproverId).HasColumnName("approver_id");
                entity.Property(a => a.ApproverRole).HasColumnName("approver_role").HasMaxLength(50);
                entity.Property(a => a.Action).HasColumnName("action").HasConversion<string>().HasMaxLength(50).IsRequired();
                entity.Property(a => a.PreviousState).HasColumnName("previous_state").HasMaxLength(100);
                entity.Property(a => a.NewState).HasColumnName("new_state").HasMaxLength(100);
                entity.Property(a => a.Comments).HasColumnName("comments").HasColumnType("text");
                entity.Property(a => a.Metadata).HasColumnName("metadata").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(a => a.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");

                entity.HasOne<User>().WithMany().HasForeignKey(a => a.ApproverId).OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(a => new { a.Entity, a.EntityId }).HasDatabaseName("idx_approval_entity");
                entity.HasIndex(a => a.ApproverId).HasDatabaseName("idx_approval_approver");
            });

            // -------- rule_change_requests
            modelBuilder.Entity<RuleChangeRequest>(entity =>
            {
                entity.ToTable("rule_change_requests");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.RuleId).HasColumnName("rule_id");
                entity.Property(r => r.ProposerId).HasColumnName("proposer_id");
                entity.Property(r => r.ProposedRuleJson).HasColumnName("proposed_rule_json").HasColumnType("json")
                      .HasConversion(v => JsonConverters.SerializeJsonDocument(v), v => JsonConverters.ParseJsonDocument(v));
                entity.Property(r => r.Rationale).HasColumnName("rationale").HasColumnType("text");
                entity.Property(r => r.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(ChangeRequestStatus.pending);
                entity.Property(r => r.ReviewedBy).HasColumnName("reviewed_by");
                entity.Property(r => r.ReviewedAt).HasColumnName("reviewed_at").HasColumnType("datetime(3)");
                entity.Property(r => r.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").HasDefaultValueSql("CURRENT_TIMESTAMP(3)");
                entity.Property(r => r.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime(3)").ValueGeneratedOnAddOrUpdate();

                entity.HasOne<ImportExportRule>().WithMany().HasForeignKey(r => r.RuleId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne<User>().WithMany().HasForeignKey(r => r.ProposerId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne<User>().WithMany().HasForeignKey(r => r.ReviewedBy).OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(r => r.Status).HasDatabaseName("idx_rcr_status");
            });
        }
    }
}
