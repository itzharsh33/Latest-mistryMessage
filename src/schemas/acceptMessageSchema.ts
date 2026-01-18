import {z} from 'zod'

export const isAcceptingMessageSchema = z.object({
    acceptMessages:z.boolean()
})