import { Client } from "@cofo/framework";
import EventEmitter from "events";
import { PaginatorEmbedOptions } from "./types";
import { ComponentInteraction, Constants } from "eris";
import { SwipeLeftDefaults, SwipeRightDefaults } from "./Constants";

export class PaginatorEmbed extends EventEmitter {
    private client: Client;
    private options: PaginatorEmbedOptions;
    private timeoutID: any;
    private messageID: string;
    private currentIndex: number;
    constructor(client: Client, options: PaginatorEmbedOptions) {
        super();
        /**
         * The Discord Client
         */
        this.client = client;
        this.options = options;
        this.timeoutID = null;
        this.messageID = '';
        this.currentIndex = 0;
        this.client.on('interactionCreate', async (interaction) => {
            if (!(interaction instanceof ComponentInteraction)) return;
            if (interaction.data.custom_id == "swipe-right") {
                this.client.getMessage(this.options.channelId, this.messageID).then((message) => {
                    message.edit({
                        embeds: [this.options.embeds[this.currentIndex + 1]]
                    }).catch((e) => {return})
                    this.currentIndex = this.currentIndex + 1
                }).catch((e) => {return})
                interaction.acknowledge();
            }
            if (interaction.data.custom_id == "swipe-left") {
                this.client.getMessage(this.options.channelId, this.messageID).then((message) => {
                    message.edit({
                        embeds: [this.options.embeds[this.options.embeds.length - 1]]
                    }).catch((e) => {return})
                    this.currentIndex = this.currentIndex - 1
                }).catch((e) => {return})
                interaction.acknowledge();
            }
        })
    }
    disableEmbed() {
        this.client.getMessage(this.options.channelId, this.messageID).then((message) => {
            message.edit({
                components: [
                    {
                        type: Constants.ComponentTypes.ACTION_ROW,
                        components: [
                            {
                                custom_id: "swipe-left",
                                emoji: this.options.emojis?.swipeLeft || SwipeLeftDefaults,
                                style: Constants.ButtonStyles.SECONDARY,
                                type: Constants.ComponentTypes.BUTTON,
                                disabled: true,
                            },
                            {
                                custom_id: "swipe-right",
                                emoji: this.options.emojis?.swipeRight || SwipeRightDefaults,
                                style: Constants.ButtonStyles.SECONDARY,
                                type: Constants.ComponentTypes.BUTTON,
                                disabled: true
                            }
                        ]
                    }
                ]
            })
        })
    };
    endEmbed() {
        this.disableEmbed()
        this.emit("end")
        clearTimeout(this.timeoutID)
    }
    /**
     * Send the message to the channel
     */
    send() {
        this.client.createMessage(this.options.channelId, {
            content: this.options.content,
            embeds: [this.options.embeds[0]],
            components: [
                {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            custom_id: "swipe-left",
                            emoji: this.options.emojis?.swipeLeft || SwipeLeftDefaults,
                            style: Constants.ButtonStyles.SECONDARY,
                            type: Constants.ComponentTypes.BUTTON,
                            disabled: this.options.embeds.length <= 1 ? true : false,
                        },
                        {
                            custom_id: "swipe-right",
                            emoji: this.options.emojis?.swipeRight || SwipeRightDefaults,
                            style: Constants.ButtonStyles.SECONDARY,
                            type: Constants.ComponentTypes.BUTTON,
                            disabled: this.options.embeds.length <= 1 ? true : false,
                        }
                    ]
                }
            ]
        }).then((message) => {
            this.messageID = message.id;
            this.timeoutID = setTimeout(() => {
                this.endEmbed();
            }, this.options.timeout)
        })
    }
}