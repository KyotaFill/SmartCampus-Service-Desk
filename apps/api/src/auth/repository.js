export function createAuthRepository(prisma) {
  const includeRole = { role: true };

  return {
    findByEmail(email) {
      return prisma.user.findUnique({ where: { email }, include: includeRole });
    },

    findById(id) {
      return prisma.user.findUnique({ where: { id }, include: includeRole });
    },

    createStudent({ email, passwordHash, fullName }) {
      return prisma.$transaction(async (transaction) => {
        const role = await transaction.role.upsert({
          where: { name: 'STUDENT' },
          update: {},
          create: {
            name: 'STUDENT',
            description: 'Sinh viên gửi và theo dõi yêu cầu hỗ trợ'
          }
        });

        return transaction.user.create({
          data: { email, passwordHash, fullName, roleId: role.id },
          include: includeRole
        });
      });
    }
  };
}
