import { validateSchema } from "@casper124578/utils";
import { Router } from "express";
import { prisma } from "lib/prisma";
import { withAuth } from "lib/auth/withAuth";
import { createAccountSchema } from "src/schemas";
import { IRequest } from "types/IRequest";

const router = Router();

router.get("/", (_, res) => {
  return res.send("hello world");
});

router.post("/", withAuth, async (req: IRequest, res) => {
  try {
    const { secret, name } = req.body;

    const [error] = await validateSchema(createAccountSchema, req.body);

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const account = await prisma.account.create({
      data: {
        secret,
        name,
        userId: req.userId!,
      },
    });

    return res.json({ account });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.delete("/:accountId", withAuth, async (req: IRequest, res) => {
  try {
    await prisma.account.delete({
      where: {
        id: req.params.accountId,
      },
    });

    return res.status(200).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

export const accountsRouter = router;
