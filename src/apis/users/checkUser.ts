import { NextApiRequest, NextApiResponse } from "next"
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET_KEY
export const checkUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { cookie } = req.headers

    if (cookie === undefined) {
        const { token } = req.body
        if (token === "") {
            return res.status(400).json({ message: "login 해주세요." })
        }
        const payload = jwt.verify(token, secretKey)
        console.log("🚀 ~ checkUser ~ payload:", payload)
        console.log(`${payload.name}님 환영합니다.`)
        res.status(200).json({ status: "token pass success" })
    } else {
        const token = cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1]
        if (!token) {
            return res.status(401).json({ message: "Token not found." })
        }
        try {
            const payload = jwt.verify(token, secretKey)
            console.log("🚀 ~ checkUser ~ payload:", payload)
            console.log(`${payload.name}님 환영합니다.`)
            res.status(200).json({ status: "token pass success" })
        } catch (err) {
            return res
                .status(401)
                .json({ message: "Invalid or expired token." })
        }
    }
}
