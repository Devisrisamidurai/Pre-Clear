CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `users` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `first_name` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `last_name` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `name` longtext CHARACTER SET utf8mb4 AS (CONCAT(COALESCE(first_name,''),' ',COALESCE(last_name,''))),
    `email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `password_hash` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `role` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `phone` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `company` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `tos_accepted` tinyint(1) NOT NULL DEFAULT FALSE,
    `tos_accepted_at` datetime(3) NULL,
    `email_verified` tinyint(1) NOT NULL DEFAULT FALSE,
    `verification_token` varchar(200) CHARACTER SET utf8mb4 NULL,
    `invite_code` varchar(100) CHARACTER SET utf8mb4 NULL,
    `invite_expires_at` datetime(3) NULL,
    `is_active` tinyint(1) NOT NULL DEFAULT TRUE,
    `metadata` json NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_users` PRIMARY KEY (`id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `approval_logs` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `entity` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `entity_id` bigint NULL,
    `approver_id` bigint NULL,
    `approver_role` varchar(50) CHARACTER SET utf8mb4 NULL,
    `action` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `previous_state` varchar(100) CHARACTER SET utf8mb4 NULL,
    `new_state` varchar(100) CHARACTER SET utf8mb4 NULL,
    `comments` text CHARACTER SET utf8mb4 NULL,
    `metadata` json NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_approval_logs` PRIMARY KEY (`id`),
    CONSTRAINT `FK_approval_logs_users_approver_id` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `audit_logs` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NULL,
    `entity` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `entity_id` bigint NULL,
    `action` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `details` json NULL,
    `performed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_audit_logs` PRIMARY KEY (`id`),
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `import_export_rules` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `country_code` varchar(2) CHARACTER SET utf8mb4 NULL,
    `hs_code` varchar(50) CHARACTER SET utf8mb4 NULL,
    `rule_key` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `title` varchar(255) CHARACTER SET utf8mb4 NULL,
    `description` text CHARACTER SET utf8mb4 NULL,
    `rule_json` json NULL,
    `source` varchar(255) CHARACTER SET utf8mb4 NULL,
    `version` int NOT NULL DEFAULT 1,
    `active` tinyint(1) NOT NULL DEFAULT TRUE,
    `effective_from` datetime(3) NULL,
    `effective_to` datetime(3) NULL,
    `created_by` bigint NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_import_export_rules` PRIMARY KEY (`id`),
    CONSTRAINT `FK_import_export_rules_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `notifications` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NULL,
    `type` varchar(100) CHARACTER SET utf8mb4 NULL,
    `message` text CHARACTER SET utf8mb4 NULL,
    `is_read` tinyint(1) NOT NULL DEFAULT FALSE,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_notifications` PRIMARY KEY (`id`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipments` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `reference_id` varchar(120) CHARACTER SET utf8mb4 NOT NULL,
    `shipment_name` varchar(255) CHARACTER SET utf8mb4 NULL,
    `mode` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Ground',
    `shipment_type` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'International',
    `carrier` varchar(100) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'UPS',
    `status` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'draft',
    `preclear_token` varchar(150) CHARACTER SET utf8mb4 NULL,
    `created_by` bigint NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_shipments` PRIMARY KEY (`id`),
    CONSTRAINT `fk_shipments_createdby` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `rule_change_requests` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `rule_id` bigint NULL,
    `proposer_id` bigint NULL,
    `proposed_rule_json` json NULL,
    `rationale` text CHARACTER SET utf8mb4 NULL,
    `status` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'pending',
    `reviewed_by` bigint NULL,
    `reviewed_at` datetime(3) NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_rule_change_requests` PRIMARY KEY (`id`),
    CONSTRAINT `FK_rule_change_requests_import_export_rules_rule_id` FOREIGN KEY (`rule_id`) REFERENCES `import_export_rules` (`id`) ON DELETE SET NULL,
    CONSTRAINT `FK_rule_change_requests_users_proposer_id` FOREIGN KEY (`proposer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `FK_rule_change_requests_users_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `ai_findings` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `rule_code` varchar(100) CHARACTER SET utf8mb4 NULL,
    `severity` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'warning',
    `message` text CHARACTER SET utf8mb4 NOT NULL,
    `suggested_action` varchar(255) CHARACTER SET utf8mb4 NULL,
    `details` json NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_ai_findings` PRIMARY KEY (`id`),
    CONSTRAINT `fk_aifindings_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `broker_requests` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `requested_document` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `message` text CHARACTER SET utf8mb4 NULL,
    `status` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Open',
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fulfilled_at` datetime(3) NULL,
    CONSTRAINT `PK_broker_requests` PRIMARY KEY (`id`),
    CONSTRAINT `fk_brokerrequests_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `broker_reviews` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `broker_id` bigint NULL,
    `status` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Pending',
    `comments` text CHARACTER SET utf8mb4 NULL,
    `reviewed_at` datetime(3) NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_broker_reviews` PRIMARY KEY (`id`),
    CONSTRAINT `fk_brokerreviews_broker` FOREIGN KEY (`broker_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_brokerreviews_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `payments` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `payer` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Shipper',
    `amount` decimal(18,2) NOT NULL,
    `currency` varchar(3) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'USD',
    `payment_status` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'pending',
    `payment_method` varchar(100) CHARACTER SET utf8mb4 NULL,
    `paid_at` datetime(3) NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_payments` PRIMARY KEY (`id`),
    CONSTRAINT `fk_payments_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_compliance` (
    `shipment_id` bigint NOT NULL,
    `dangerous_goods` tinyint(1) NOT NULL DEFAULT FALSE,
    `lithium_battery` tinyint(1) NOT NULL DEFAULT FALSE,
    `food_pharma_flag` tinyint(1) NOT NULL DEFAULT FALSE,
    `eccn` varchar(50) CHARACTER SET utf8mb4 NULL,
    `export_license_required` tinyint(1) NOT NULL DEFAULT FALSE,
    `restricted_flag` tinyint(1) NOT NULL DEFAULT FALSE,
    `sanctioned_country_flag` tinyint(1) NOT NULL DEFAULT FALSE,
    `risk_level` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Low',
    `ai_score` int NULL,
    `ai_status` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'NeedsDocuments',
    `ai_notes` json NULL,
    CONSTRAINT `PK_shipment_compliance` PRIMARY KEY (`shipment_id`),
    CONSTRAINT `fk_compliance_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_documents` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `document_type` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Other',
    `file_url` varchar(2000) CHARACTER SET utf8mb4 NULL,
    `uploaded_by` bigint NULL,
    `verified_by_broker` tinyint(1) NOT NULL DEFAULT FALSE,
    `uploaded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `version` int NOT NULL DEFAULT 1,
    CONSTRAINT `PK_shipment_documents` PRIMARY KEY (`id`),
    CONSTRAINT `fk_docs_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_items` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `product_name` varchar(500) CHARACTER SET utf8mb4 NULL,
    `description` text CHARACTER SET utf8mb4 NULL,
    `hs_code` varchar(50) CHARACTER SET utf8mb4 NULL,
    `quantity` decimal(18,3) NOT NULL DEFAULT 1.0,
    `unit` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'pcs',
    `unit_price` decimal(18,4) NULL,
    `total_value` decimal(18,4) NULL,
    `country_of_origin` varchar(100) CHARACTER SET utf8mb4 NULL,
    `export_reason` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Sale',
    CONSTRAINT `PK_shipment_items` PRIMARY KEY (`id`),
    CONSTRAINT `fk_items_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_messages` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `sender_id` bigint NULL,
    `message` text CHARACTER SET utf8mb4 NOT NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_shipment_messages` PRIMARY KEY (`id`),
    CONSTRAINT `fk_msgs_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_msgs_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_packages` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `package_type` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Box',
    `length` decimal(10,3) NULL,
    `width` decimal(10,3) NULL,
    `height` decimal(10,3) NULL,
    `dimension_unit` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'cm',
    `weight` decimal(12,3) NULL,
    `weight_unit` varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'kg',
    `stackable` tinyint(1) NOT NULL DEFAULT FALSE,
    CONSTRAINT `PK_shipment_packages` PRIMARY KEY (`id`),
    CONSTRAINT `fk_packages_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_parties` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `party_type` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `company_name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `contact_name` varchar(200) CHARACTER SET utf8mb4 NULL,
    `phone` varchar(50) CHARACTER SET utf8mb4 NULL,
    `email` varchar(255) CHARACTER SET utf8mb4 NULL,
    `address1` varchar(500) CHARACTER SET utf8mb4 NULL,
    `address2` varchar(500) CHARACTER SET utf8mb4 NULL,
    `city` varchar(150) CHARACTER SET utf8mb4 NULL,
    `state` varchar(150) CHARACTER SET utf8mb4 NULL,
    `postal_code` varchar(50) CHARACTER SET utf8mb4 NULL,
    `country` varchar(100) CHARACTER SET utf8mb4 NULL,
    `tax_id` varchar(100) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_shipment_parties` PRIMARY KEY (`id`),
    CONSTRAINT `fk_parties_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_services` (
    `shipment_id` bigint NOT NULL,
    `service_level` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Standard',
    `incoterm` varchar(20) CHARACTER SET utf8mb4 NULL,
    `bill_to` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'Shipper',
    `currency` varchar(3) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'USD',
    `declared_value` decimal(18,2) NULL,
    `insurance_required` tinyint(1) NOT NULL DEFAULT FALSE,
    CONSTRAINT `PK_shipment_services` PRIMARY KEY (`shipment_id`),
    CONSTRAINT `fk_services_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `shipment_tracking` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `shipment_id` bigint NOT NULL,
    `status` varchar(200) CHARACTER SET utf8mb4 NULL,
    `location` varchar(255) CHARACTER SET utf8mb4 NULL,
    `event_time` datetime(3) NULL,
    `details` json NULL,
    `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT `PK_shipment_tracking` PRIMARY KEY (`id`),
    CONSTRAINT `fk_tracking_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `idx_aifindings_shipment` ON `ai_findings` (`shipment_id`);

CREATE INDEX `idx_approval_approver` ON `approval_logs` (`approver_id`);

CREATE INDEX `idx_approval_entity` ON `approval_logs` (`entity`, `entity_id`);

CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity`, `entity_id`);

CREATE INDEX `IX_audit_logs_user_id` ON `audit_logs` (`user_id`);

CREATE INDEX `idx_brokerrequests_shipment` ON `broker_requests` (`shipment_id`);

CREATE INDEX `idx_brokerreviews_shipment` ON `broker_reviews` (`shipment_id`);

CREATE INDEX `IX_broker_reviews_broker_id` ON `broker_reviews` (`broker_id`);

CREATE INDEX `idx_rules_active` ON `import_export_rules` (`active`);

CREATE INDEX `idx_rules_country` ON `import_export_rules` (`country_code`);

CREATE INDEX `idx_rules_hs` ON `import_export_rules` (`hs_code`);

CREATE INDEX `idx_rules_key` ON `import_export_rules` (`rule_key`);

CREATE INDEX `IX_import_export_rules_created_by` ON `import_export_rules` (`created_by`);

CREATE INDEX `idx_notifications_user` ON `notifications` (`user_id`);

CREATE INDEX `idx_payments_shipment` ON `payments` (`shipment_id`);

CREATE INDEX `idx_payments_status` ON `payments` (`payment_status`);

CREATE INDEX `idx_rcr_status` ON `rule_change_requests` (`status`);

CREATE INDEX `IX_rule_change_requests_proposer_id` ON `rule_change_requests` (`proposer_id`);

CREATE INDEX `IX_rule_change_requests_reviewed_by` ON `rule_change_requests` (`reviewed_by`);

CREATE INDEX `IX_rule_change_requests_rule_id` ON `rule_change_requests` (`rule_id`);

CREATE INDEX `idx_compliance_ai_status` ON `shipment_compliance` (`ai_status`);

CREATE INDEX `idx_documents_shipment` ON `shipment_documents` (`shipment_id`);

CREATE INDEX `idx_items_hscode` ON `shipment_items` (`hs_code`);

CREATE INDEX `idx_items_shipment` ON `shipment_items` (`shipment_id`);

CREATE INDEX `idx_msgs_shipment` ON `shipment_messages` (`shipment_id`);

CREATE INDEX `IX_shipment_messages_sender_id` ON `shipment_messages` (`sender_id`);

CREATE INDEX `idx_packages_shipment` ON `shipment_packages` (`shipment_id`);

CREATE INDEX `idx_parties_shipment` ON `shipment_parties` (`shipment_id`);

CREATE INDEX `idx_services_shipment` ON `shipment_services` (`shipment_id`);

CREATE INDEX `idx_tracking_shipment` ON `shipment_tracking` (`shipment_id`);

CREATE INDEX `idx_shipments_mode` ON `shipments` (`mode`);

CREATE INDEX `idx_shipments_reference` ON `shipments` (`reference_id`);

CREATE INDEX `idx_shipments_status` ON `shipments` (`status`);

CREATE INDEX `IX_shipments_created_by` ON `shipments` (`created_by`);

CREATE INDEX `idx_users_active` ON `users` (`is_active`);

CREATE INDEX `idx_users_role` ON `users` (`role`);

CREATE UNIQUE INDEX `IX_users_email` ON `users` (`email`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20251206155327_InitialCreate', '8.0.0');

COMMIT;

