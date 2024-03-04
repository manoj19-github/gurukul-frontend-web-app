const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

(async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Software Programming" },
        { name: "Fashion Designing" },
        { name: "Video Editing" },
        { name: "Buisness" },
        { name: "Finance & Accounting" },
        { name: "Marketing" },
        { name: "Lifestyle" },
        { name: "Music" },
        { name: "Teaching & Academic" },
        { name: "Health & Fitness" },
        { name: "Personal Development" },
      ],
    });
    console.log("categories created");
  } catch (error) {
    console.log(error);
  } finally {
    await database.$disconnect();
  }
})();
