import db from "../prisma"
import { get_user_by_username, get_user_id_by_username } from "./users";
const prisma = db;

export const get_file_by_path = async (path: string) => {
    const file = await prisma.files.findFirst({
        where: {
            path: path
        }
    })

    if(!file){
        return null;
    }

    return file;
}