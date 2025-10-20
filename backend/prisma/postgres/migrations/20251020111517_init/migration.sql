-- CreateTable
CREATE TABLE "TestModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestModel_pkey" PRIMARY KEY ("id")
);
