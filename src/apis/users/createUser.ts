import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, name } = req.body
    if (email === undefined || password === undefined || name === undefined) {
        return res
            .status(400)
            .json({ message: "email, 비밀번호, 이름이 필요합니다." })
    }

    const hashedPassword = await hash(password, 10)
    const users = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
            token: "",
        },
    })

    res.status(200).json({ status: "success", idx: users.idx })
}
