-- CreateTable
CREATE TABLE "PaymentVoucher" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PaymentVoucher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentVoucher" ADD CONSTRAINT "PaymentVoucher_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
