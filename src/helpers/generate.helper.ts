export const generateRandomString = (length: number) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.random() * chars.length);
    }

    return result;
}

export const generateRandomNumber = (length: number) => {
    const chars = "0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.random() * chars.length);
    }

    return result;
}