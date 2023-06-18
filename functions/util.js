
/**
 * Parses a PubSub message. The data is usually base64-encoded JSON.
 *
 * @param {{ data: string } | string} messageOrData Either a PubSub message object with a data property, or just the data property itself.
 */
export function parsePubSubMessage(messageOrData) {
    return JSON.parse(
        Buffer.from(messageOrData.data ?? messageOrData, "base64").toString()
    )
}