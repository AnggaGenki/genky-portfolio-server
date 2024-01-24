import prismaClient from "../../application/database.js";

const UserLogoutService = async (pUser) => {
  await prismaClient.user.update({
    where: {
      id: pUser.id,
    },
    data: {
      token: null,
    },
  });
};

export default UserLogoutService;
