# Cofo-Framework
- A framework designed to build bots on top of eris with ease. 

# Description
- This is a **OPTIONAL** plugin for `@cofo/framework` for using Paginated Embeds.

# Installation & Usage
- ```npm install @cofo/plugin-paginated-embed```


- Usage:
```ts
import { PaginatorEmbed } from "@cofo/plugin-pagination-embed";
import { Embed } from "@cofo/framework";

new PaginatorEmbed(client,{
    channelId: "ENTER A CHANNEL ID",
    timeout: 0,
    embeds: [
        new Embed().setDescription("Hi"),
        new Embed().setDescription("Hi 2")
    ],
})
```