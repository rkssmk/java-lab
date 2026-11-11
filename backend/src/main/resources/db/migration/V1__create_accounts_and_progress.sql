CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(32) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    recovery_code_hash VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    age_18_confirmed_at TIMESTAMPTZ NOT NULL,
    terms_version VARCHAR(40) NOT NULL,
    terms_accepted_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,32}$')
);
CREATE UNIQUE INDEX ux_app_users_username_ci ON app_users (lower(username));

CREATE TABLE privacy_consent_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    consent_version VARCHAR(40) NOT NULL,
    consent_sha256 CHAR(64) NOT NULL,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_consent_user_id ON privacy_consent_receipts(user_id);

CREATE TABLE user_progress (
    user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
    revision BIGINT NOT NULL DEFAULT 1,
    state JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_progress_revision CHECK (revision > 0)
);

-- No email, date of birth, phone, raw IP, source-code logs, or user-agent data are collected by this schema.
