import { loginUser } from "@/apis/users/loginUser"
import { NextApiRequest, NextApiResponse } from "next"

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === "POST") {
            await loginUser(req, res)
        } else {
            res.status(400).json({
                message: "지원하지 않는 메서드입니다.",
            })
        }
    } catch (e: any) {
        res.status(500).json({
            message: e.message,
        })
    }
}

export default login
