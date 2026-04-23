import prisma from "../../config/database.js";
export const getUserContracts = async (req, res) => {
  try {
    const { id, role } = req.user;

    let filter = {};
    if (role == "CLIENT") {
      filter = {
        project: { clientId: id }
      };
    } else {
      filter = { freelancerId: id };
    }
    const contracts = await prisma.contract.findMany({
      where: filter,
      include: {
        project: true,
        freelancer: true
      }
    });
    res.status(200).json(contracts);


  }
  catch (error) {
    console.error("Fetch Contracts Error", error);
    res.status(500).json({ message: "Server Error fetching contracts" })
  }
}
export const releaseFunds = async (req, res) => {
  try {
    const { contractId } = req.params;
    const id = req.user.id;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { project: true }
    });
    if (!contract) {
      return res.status(404).json({ message: "No Contract Found" });
    }
    if (id != contract.project.clientId) {
      return res.status(403).json({ message: "Invalid Access" });
    }
    const result = await prisma.$transaction(async (tx) => {
      // subtracting held amount
      await tx.user.update({
        where: { id: contract.project.clientId },
        data: {
          heldAmount: {
            decrement: contract.totalAmount
          }
        }
      });
      // updating balance of freelancer
      await tx.user.update({
        where: { id: contract.freelancerId },
        data: {
          walletBalance: {
            increment: contract.totalAmount
          }
        }
      });
      // update the status -> CONTRACT
      await tx.contract.update({
        where: { id: contractId },
        data: { status: "COMPLETED" }
      });
      // update the status -> PROJECT
      await tx.project.update({
        where: { id: contract.projectId },
        data: { status: "COMPLETED" }
      });
      return { message: "Success" };


    });
    res.status(200).json(result);
  }
  catch (error) {
    console.error("Release Funds Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
