import express from "express";
import { prisma, createKey, errorLog } from "utils";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (!body.user || !body.id) {
      return res.sendStatus(400);
    }

    console.log(body);

    const User = await prisma.userV2.findUnique({
      where: {
        username: body.user.toLowerCase(),
        connection: {
          some: {
            service: "discord",
            serviceid: body.id,
          },
        },
      },
      include: {
        webinterface: true,
        connection: true,
      },
    });

    if (!User) {
      const Key = createKey(body.user.toLowerCase(), body.id);

      const User = await prisma.userV2.create({
        data: {
          username: body.user.toLowerCase(),
          connection: {
            create: {
              service: "discord",
              username: body.user.toLowerCase(),
              serviceid: body.id,
            },
          },
          webinterface: {
            create: {
              theme: body.theme || "default",
              style: body.namestyle || "uppercase",
              nexusmods: body.nexusmods,
              github: body.github,
              description: body.description,
            },
          },
          keys: {
            create: {
              key: Key.key,
              name: Key.name,
              permission: Key.permissionSet,
            },
          },
        },
      });

      return res.send(User);
    }

    const UserUpdate = await prisma.userV2.update({
      where: {
        id: User.id,
      },
      data: {
        webinterface: {
          upsert: {
            where: {
              id: User.webinterface[0].id,
            },
            create: {
              theme: body.theme || "default",
              style: body.namestyle || "uppercase",
              nexusmods: body.nexusmods,
              github: body.github,
              description: body.description,
            },
            update: {
              theme: body.theme || User.webinterface[0].theme,
              style: body.namestyle || User.webinterface[0].style,
              nexusmods: body.nexusmods || User.webinterface[0].nexusmods,
              github: body.github || User.webinterface[0].github,
              description: body.description || User.webinterface[0].description,
            },
          },
        },
      },
    });

    return res.send(UserUpdate);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
});

export default router;
