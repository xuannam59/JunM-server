import { SetMetadata } from "@nestjs/common";

// Customize Response Message
export const RESPONSE_MESSAGE = 'response_message';
 export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);