-- CreateTable
CREATE TABLE "signups" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "verify_token" TEXT,
    "verify_token_expires_at" TIMESTAMPTZ,
    "email_verified_at" TIMESTAMPTZ,
    "survey_completed_at" TIMESTAMPTZ,
    "intent" TEXT,
    "chains_used" TEXT[],
    "first_thing" TEXT,
    "priority_tier" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT,
    "utm" JSONB,
    "ip_hash" TEXT,
    "country" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "signups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "signup_id" UUID,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signups_email_key" ON "signups"("email");

-- CreateIndex
CREATE UNIQUE INDEX "signups_verify_token_key" ON "signups"("verify_token");

-- CreateIndex
CREATE INDEX "signups_priority_tier_created_at_idx" ON "signups"("priority_tier", "created_at");

-- CreateIndex
CREATE INDEX "signups_status_idx" ON "signups"("status");

-- CreateIndex
CREATE INDEX "signups_ip_hash_created_at_idx" ON "signups"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "events_signup_id_idx" ON "events"("signup_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_signup_id_fkey" FOREIGN KEY ("signup_id") REFERENCES "signups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
