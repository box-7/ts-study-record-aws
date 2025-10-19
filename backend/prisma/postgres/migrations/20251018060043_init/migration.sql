-- CreateTable
CREATE TABLE "StudyRecord" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyRecord_pkey" PRIMARY KEY ("id")
);
