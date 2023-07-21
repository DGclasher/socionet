import jwt from 'jsonwebtoken'

export const verifyToken = async(req, res, next)=>{
    try {
        let token = req.header("Authorization")
        if(!token) return res.status(403).send("Access denied")
        if(token.startsWith("Bearer")){
            token = token.split(' ')[1]
            const validated = jwt.verify(token, process.env.JWT_SECRET)
            req.user = validated
            next()
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}