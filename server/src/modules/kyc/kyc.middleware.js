import prisma from "../../config/database.js";

const kycmiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: { kyc: true }
    });
    if (!user || !user.kyc || user.kyc.status !== "APPROVED") {
      return res.status(403).json({ message: "Identity verification required.Please complete your KYC in the settings." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Security Check Failed" });
  }
}

export default kycmiddleware;
