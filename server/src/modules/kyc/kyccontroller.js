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
    const user = await prisma.kYC.create({
      data: {
        userId: userID,
        documentType: req.body.documentType,
        documentUrl: req.file.path,
        status: "PENDING"
      }
    });
    res.status(201).json({
      message: "Document uploaded seccessfully",
      user: {
        userId: userID,
        documentType: user.documentType,
        documentUrl: user.documentUrl
      }
    }
    );
  }
  catch (error) {
    console.error("KYC Submission Error:", error);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}
