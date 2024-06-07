import db from "../prisma"
const prisma = db;

export const get_user_id_by_email = async(email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if(!user){
        return null;
    }

    return user.id;
}

export const get_user_id_by_username = async(username: string) => {
    const user = await prisma.user.findFirst({
        where: {
            user_name: username
        }
    })

    if(!user){
        return null;
    }

    return user.id;
}

export const get_user_by_username = async(username: string) => {
    const user = await prisma.user.findFirst({
        where: {
            user_name: username
        }
    })

    if(!user){
        return null;
    }

    return user;
}

export const get_user_by_email = async(email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if(!user){
        return null;
    }

    return user;
}