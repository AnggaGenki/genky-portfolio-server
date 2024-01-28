import prismaClient from "../../application/database.js";

const UserDeleteService = async (pUser) => {
  await prismaClient.user.delete({
    where: {
      id: pUser.id,
    },
  });
};

export default UserDeleteService;
