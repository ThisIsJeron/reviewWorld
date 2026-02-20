-- CreateIndex
CREATE INDEX "Brand_status_idx" ON "Brand"("status");

-- CreateIndex
CREATE INDEX "ProductLine_status_idx" ON "ProductLine"("status");

-- CreateIndex
CREATE INDEX "ProductLine_brandId_idx" ON "ProductLine"("brandId");

-- CreateIndex
CREATE INDEX "Review_variationId_idx" ON "Review"("variationId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Variation_status_idx" ON "Variation"("status");

-- CreateIndex
CREATE INDEX "Variation_productLineId_idx" ON "Variation"("productLineId");
