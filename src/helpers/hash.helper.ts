import * as bcrypt from 'bcrypt';


export const hashPasswordHelper = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePasswordHelper = async (password: string, hash: string) : Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}   