import Eris from "eris";

interface Emojis {
    swipeLeft: Eris.PartialEmoji;
    swipeRight: Eris.PartialEmoji;
}

export interface PaginatorEmbedOptions {
    timeout: number;
    channelId: string;
    content?: string;
    emojis?: Emojis;
    embeds: Eris.EmbedOptions[];
}