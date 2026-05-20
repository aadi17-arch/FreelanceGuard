import prisma from "../../config/database.js";

export const submitKYC = async (req, res) => {
  try {
    const userID = req.user.id;
    const file = req.file;
    if (!userID || !file) {
      return res.status(400).json({ message: "USER or FILE doesnt exist" });
    }
    const existingKYC = await prisma.kYC.findUnique({
      where: { userId: userID }
    });
    if (existingKYC) {
      return res.status(400).json({ message: "KYC already Submitted" });
    }
    const kycRecord = await prisma.kYC.create({
      data: {
        userId: userID,
        documentType: req.body.documentType,
        documentUrl: req.file.path.replace(/\\/g, '/'),
        status: "PENDING"
      }
    });
    res.status(201).json({
      message: "Document uploaded successfully",
      user: {
        userId: userID,
        documentType: kycRecord.documentType,
        documentUrl: kycRecord.documentUrl
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const getPendingKYC = async (req, res) => {
  try {
    const pending = await prisma.kYC.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(pending);
  } catch (e) {
    return res.status(500).json({ message: "Server error." });
  }
};

export const verifyKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    const kyc = await prisma.kYC.findUnique({
      where: { id }
    });
    if (!kyc) {
      return res.status(400).json({ message: "KYC record not found." });
    }
    const updateKYC = await prisma.kYC.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === "APPROVED" ? new Date() : null
      }
    });
    res.json({
      message: `KYC verified successfully ${status.toLowerCase()}`,
      kyc: updateKYC
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error." });
  }
};
