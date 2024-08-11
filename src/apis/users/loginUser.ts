import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()
const secretKey = process.env.JWT_SECRET_KEY
export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body
    if (email === undefined || password === undefined) {
        return res
            .status(400)
            .json({ message: "email, 비밀번호이 필요합니다." })
    }
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    })
    if (user === null) {
        return res.status(400).json({ message: "유저가 없습니다." })
    }

    const hashedPassword = user.password
    const isCollect = await compare(password, hashedPassword)
    if (isCollect !== true) {
        return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." })
    }
    const token = jwt.sign(
        {
            email: user.email,
            name: user.name,
        },
        secretKey,
        {
            expiresIn: "1h",
        }
    )
    await prisma.user.update({
        where: { idx: user.idx },
        data: { token: token },
    })
    res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=${10 * 60 * 60}`
    )
    res.status(200).json({ status: "success" })
}
